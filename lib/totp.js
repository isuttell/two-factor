/*******************************************************************************
 * totp
 *
 * @author       Isaac Suttell <isaac@isaacsuttell.com>
 * @file         Creates a Time based One Time Password
 ******************************************************************************/

var _ = require('lodash');
var hotp = require('./hotp.js');

/**
 * Generates a time based one time password pased on the key
 *
 * @param     {String}    key
 * @param     {Obect}    options
 * @return    {Number}
 */
module.exports = function totp(key, options) {
  // Options
  options = _.extend({
    length: 6,
    step: 30,
    time: false
  }, options || {});

  // Get the current time or user supplied
  var time = options.time || new Date().getTime() / 1000;

  // Update the counter every `step` secpmds
  options.counter = Math.floor(time / options.step);

  // Generate the code using hotp
  var code = hotp(key, options);

  return code;
};
