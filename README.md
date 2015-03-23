# temail

This document is intended to be both a description of `temail` as well as an informal spec for its behaviour. The labels (such as `RInfo`), scattered throughout are intended to help understand/reason about the implementation and might reflect checks carried out within the source code.

`temail` is a tool to help you send a templated email to one or more recipients using a given email account.

It is currently a command line only tool, and has a couple of options you will need to provide - either manually each time you run the tool, or you have the option to use a config file (as well as input arguments).

The following is a list of *required* information for `temail` to do its job. The items prepended with **--** are command line arguments you can provide when running `temail`:

* **--template**: the path to a file containing the email body as a [Handlebars](http://handlebarsjs.com/ "handlebarsjs.com") template
* **--data**: the path to a file containing JSON data to use during template compilation (more on what's expected of this file [below](#the-data-file))
* **--service**: One of the services supported by [Nodemailer](https://github.com/andris9/nodemailer-wellknown#supported-services)
* **--email**: the email account to use to send your templated emails with
* **--from**: the `from` field in the email being sent
* **--to**: the `to` field in the email being sent"
* **--subject**: the `subject` field in the email being sent
* **password**: the password to access the email account to use to send your templated emails with

*Note that **password** is a required piece of information but it will be ignored if you pass it in as a command line argument.*

All together, these bits of information make up what in this document will be referred to as `RInfo` - required info.

`SInfo` will refer to sensitive information, of which there is only **password** at this stage.

`SafeRInfo` = `RInfo` - `SInfo`

The following is a list of *optional* information you can supply to `temail`. They are listed here in command line argument form:

* **--log-level**: sets the log level for `temail` (used to debug `temail`) - the default value is `off`
* **--log-path**: sets the path to the log file for `temail` to log to (used to debug `temail`) - the default value is `temail.log`

All together, these bits of information make up what in this document will be referred to as `OInfo` - optional info.

# $HOME/.temail.json

When setting itself up, `temail` will consult the file `$HOME/.temail.json` if it exists (where `$HOME` is the root user directory of the user you are logged in as).

*Command line arguments take precedence over any configuration set in this config file.*

Regardless of what info this file has, only members of `ConfInfo` will get picked up. These include:

* template
* data
* service
* email
* from
* to
* subject
* logger
  * level
  * path

Currently, `ConfInfo` = `SafeRInfo` + `OInfo`

An example of this JSON file containing values for all `ConfInfo` follows (you can pick and choose what to include):

```json
{
    "template": "~/email-templates/exam/exam-voucher.hbs",
    "data": "~/email-templates/exam/data.json",
    "service": "Gmail",
    "email": "someone@gmail.com",
    "from": "someone@gmail.com",
    "to": ["student1@gmail.com", "student2@gmail.com"],
    "subject": "Exam voucher",

    "logger": {
        "level": "info",
        "path": "~/.temail.log"
    }
}
```

# Prompt session

If `RInfo` is not complete with the information you've supplied through command line arguments and the `.temail.json` file, you will be prompted for their values as `temail` cannot proceed without them.

Note the following:

* this prompt session will always happen for at least the members of `SInfo` which are also in `RInfo` (the prompt will not echo out the values of `SInfo` you supply, nor will these values be logged out regardless of which `--log-level` you're using).
* when filling in the information for **--to** during this prompt session, keep in mind that you need to comma separate the values, e.g. `student1@gmail.com,student2@gmail.com,  student3@gmail.com  , student4@gmail.com`

# The data file

The data file is the file specified by the **--data** option. It is expected to be in this format:

```json
[
    "student1@gmail.com": {
        "name": "John",
        "surname": "Doe"
    },
    // etc...
]
```

i.e. it is expected that this JSON file contains keys which match up with the values in the **--to** array. You can have more recipients in this JSON file than there are specified in **--to** but if you have less, `temail` will error out (the extra recipients in this data file will just be ignored).

* Let `DataForAllRecip` be a boolean indication of whether or not the data file contains, at least, enough keys as the recipients specified in **--to** array.

The value for each key (i.e. for each recipient), is expected to contain all the data necessary to fill in the variables in the template **--template**. Any extra values will be ignored. Any missing values will cause `temail` to error out.



