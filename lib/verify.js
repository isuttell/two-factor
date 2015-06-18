/*******************************************************************************
 * verify
 *
 * @author       Isaac Suttell <isaac@isaacsuttell.com>
 * @file         Verify a code is correct against a key
 ******************************************************************************/

var _ = require('lodash');
var totp = require('./totp.js');
var hotp = require('./hotp.js');

/**
 * Generates a time based one time password pased on the key
 *
 * @param     {Number}    code
 * @param     {String}    key
 * @param     {Object}    options
 * @return    {Boolean}
 */
module.exports = function verify(code, key, options) {
  // Options
  options = _.extend({
    type: 'totp',
  }, options || {});

  // Generate the code and verify
  if (options.type === 'totp') {
    return parseInt(code, 10) === parseInt(totp(key, options), 10);
  } else if (options.type === 'totp') {
    return parseInt(code, 10) === parseInt(hotp(key, options), 10);
  } else {
    return new TypeError('InvalidCodeType');
  }
};
