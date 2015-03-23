
class NoTemplateDataError extends Error {

  constructor(message = `the given data file has no data for the recipient ${recipient}`, recipient) {
    this.message = message;
    this.recipient = recipient;
  }

}

module.exports = NoTemplateDataError;

