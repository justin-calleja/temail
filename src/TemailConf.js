"use strict";

var path           = require("path")
  , osenv          = require("osenv")
  , _              = require("lodash")
  , utils          = require("./utils")
  , bunyan         = require("bunyan");

class TemailConf {

  /**
   * If conf is passed in, no config file is read.
   */
  constructor ({
    conf,
    confFilePath = path.resolve(osenv.home(), ".temail.json"),
    log
  }) {
    if(log && log.streams) {
      this.log.streams = log.streams;
      this.log.level(log.level());
    }

    if(conf === undefined || conf === null || conf === {}) {
      this.conf = this.readConf(confFilePath);
    } else {
      this.log.trace("No config file was used - using given conf");
      this.conf = conf;
    }

    this.log.trace({ conf: this.conf }, "New TemailConf configuration after constructor");
  }

  readConf (filePath) {
    var conf = {};
    try {
      conf = require(filePath);
      this.log.info(`Using conf file ${filePath}`);
    } catch(e) {
      this.log.info(`No config file found at ${filePath}`);
    }

    this.log.debug({ conf: conf }, "The value readConf() returns");
    return conf;
  }

  get template () {
    return this.conf.template;
  }

  get data () {
    return this.conf.data;
  }

  get service () {
    return this.conf.service;
  }

  get email () {
    return this.conf.email;
  }

  get from () {
    return this.conf.from;
  }

  get to () {
    if(Array.isArray(this.conf.to)) {
      return this.conf.to;
    } else if(typeof this.conf.to === "string") {
      return this.conf.to.split(",").map( (recipient) => {
        return recipient.trim();
      });
    }
    return undefined;
  }

  get subject () {
    return this.conf.subject;
  }
}

/**
 * Overwrites this.conf with conf using customizer
 * (see lodash assign doc for customizer: https://lodash.com/docs#assign)
 */
TemailConf.prototype.overwrite = function overwrite (conf, customizer) {
  this.log.debug({ conf: this.conf }, "Configuration before overwrite");
  this.conf = _.assign(this.conf, conf, customizer);
  this.log.debug({ conf: this.conf }, "Configuration after overwrite");
};

/**
 * undefined values will not overwrite
 */
TemailConf.prototype.overwriteUnlessUndefined = function overwriteUnlessUndefined (conf) {
  this.overwrite(conf, (objVal, srcVal) => typeof srcVal === "undefined" ? objVal : srcVal);
};

/**
 * Returns an array of required but missing conf fields.
 */
TemailConf.prototype.missingConfFields = function missingConfFields () {
  var missing = [];

  if(!this.conf.subject) missing.unshift("subject");
  if(!this.conf.to) missing.unshift("to");
  if(!this.conf.from) missing.unshift("from");
  if(!this.conf.template) missing.unshift("template");
  if(!this.conf.data) missing.unshift("data");
  if(!this.conf.email) missing.unshift("email");
  if(!this.conf.service) missing.unshift("service");

  return missing;
};

/**
 * Checks whether or not the given dataAsObj contains, at least, enough keys as the recipients in this.to
 */
TemailConf.prototype.hasDataForAllRecip = function hasDataForAllRecip (dataAsObj) {
  var result = { hasDataForAllRecip: true };

  _.keys(dataAsObj).forEach((key) => {
    if(this.to.indexOf(key) < 0) {
      result.hasDataForAllRecip = false;
      result.missingRecip = key;
      return result;
    }
  });

  return result;
};

TemailConf.prototype.questionFor = function questionFor (confField) {
  switch (confField) {
    case "email":
      return {
      type: "input",
      name: confField,
      message: "Email account to use to send emails with:"
    };
    break;
    case "template":
      return {
      type: "input",
      name: confField,
      message: "Path to file containing email body as handlebars template:"
    };
    break;
    case "data":
      return {
      type: "input",
      name: confField,
      message: "Path to file containing JSON data to use during template compilation"
    };
    break;
    case "to":
      return {
      type: "input",
      name: confField,
      message: "The `to` field in the email being sent (comma separated):"
    };
    break;
    case "from":
      return {
      type: "input",
      name: confField,
      message: "The `from` field in the email being sent:"
    };
    break;
    case "subject":
      return {
      type: "input",
      name: confField,
      message: "The `subject` field in the email being sent:"
    };
    break;
    case "service":
      return {
      type: "list",
      name: confField,
      message: "Which nodemailer-wellknown service will you be using?",
      choices: [
        "1und1",
        "AOL",
        "DynectEmail",
        "FastMail",
        "GandiMail",
        "Gmail",
        "Godaddy",
        "GodaddyAsia",
        "GodaddyEurope",
        "hot.ee",
        "Hotmail",
        "iCloud",
        "mail.ee",
        "Mail.ru",
        "Mailgun",
        "Mailjet",
        "Mandrill",
        "Naver",
        "Postmark",
        "QQ",
        "QQex",
        "SendCloud",
        "SendGrid",
        "SES",
        "Yahoo",
        "Yandex",
        "Zoho"
      ],
      default: "Gmail"
    };
    break;
  }

  utils.logAndError(this.log, `No question for confField ${confField}`);
};

// no logging by default
// set logger on instantiation
TemailConf.prototype.log = bunyan.createLogger ({
  name: path.basename(__filename),
  streams: []
});

// TemailConf is transpiled as var TemailConf = // class def
// so it's value won't be assigned until it is executed which means
// you'll want to assign TemailConf to module.exports *after* the var Temail gets its value
// i.e. just do this at the bottom of the file:
module.exports = TemailConf;

