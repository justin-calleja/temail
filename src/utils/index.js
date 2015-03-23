"use strict";

var utils = module.exports;

utils.logAndError = function(logger, message) {
  logger.error(message);
  throw new Error(message);
};

