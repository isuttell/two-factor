/*******************************************************************************
 * hotp
 *
 * @author       Isaac Suttell <isaac@isaacsuttell.com>
 * @file         Creates a HMAC based One Time Password
 ******************************************************************************/

// Modules
var crypto = require('crypto');
var base32 = require('thirty-two');
var _ = require('lodash');

/**
 * Convert a number to a byte array
 *
 * @param     {Number}    num
 * @return    {Array<number>}
 */
function intToBytes(num) {
  var bytes = [];
  for (var i = 7; i >= 0; --i) {
    bytes[i] = num & 255;
    num = num >> 8;
  }
  return bytes;
}

/**
 * Take a hex hash and convert it to bytes
 *
 * @param     {String}    hex
 * @return    {Array<Number>}
 */
function hexToBytes(hex) {
  var bytes = [];
  for (var c = 0, C = hex.length; c < C; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

/**
 * Computes a htop code based on a hmac result
 * See: http://tools.ietf.org/html/rfc4226#section-5.4
 *
 * @param     {String}    digest
 * @return    {String}
 */
function calculate(digest) {
  var offset = digest[19] & 0xf;
  var code = (digest[offset] & 0x7f) << 24 | (digest[offset + 1] & 0xff) << 16 | (digest[offset + 2] & 0xff) << 8 | (digest[offset + 3] & 0xff);
  return code.toString();
}

/**
 * Takes a key and produces a HMAC based One Time Password
 *
 * @param     {String}    key
 * @param     {Object}    options
 * @return    {Number}
 */
module.exports = function hotp(key, options) {
  // Options
  options = _.extend({
    length: 6,
    counter: 0
  }, options || {});

  // Convert to base32
  key = base32.decode(key);

  // Setup the  has message auth code
  var hmac = crypto.createHmac('sha1', new Buffer(key));

  // Create a buffer based on the counter/time
  var buffer = new Buffer(intToBytes(options.counter));

  // Apply the counter
  hmac.update(buffer);

  // Create hash
  var digest = hexToBytes(hmac.digest('hex'));

  // Calculate code
  var code = calculate(digest);

  code = code.substr(code.length - options.length, options.length);

  return code;
};
