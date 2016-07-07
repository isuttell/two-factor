/*******************************************************************************
 * generate
 *
 * @author       Isaac Suttell <isaac@isaacsuttell.com>
 * @file         Generate secret keys and qrcode short links
 ******************************************************************************/

// Modules
var _ = require('lodash');
var base32 = require('thirty-two');
var qr = require('qr-image');

/**
 * Creates a random string
 *
 * @param     {Object}    options
 * @return    {String}
 */
function randomString(options) {
  var set = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

  if (options.symbols === true) {
    set += '!@#$%^&*()<>?/[]{},.:;';
  }

  var key = '';
  for (var i = 0; i < options.length; i++) {
    key += set.charAt(Math.floor(Math.random() * set.length));
  }

  return key;
}

/**
 * Generate link to encode in qrcode
 *
 * @param     {String}    key
 * @param     {String}    name
 * @return    {String}
 */
function otpauth(key, name, issuer) {
  var code = 'otpauth://totp/' + encodeURIComponent(name);
  code += '?secret=' + encodeURIComponent(key);
  code += '&issuer=' + encodeURIComponent(issuer);
  return code;
}

/**
 * Create a Google charts link to a QR Code with the key embeded in it
 *
 * @param     {String}    key
 * @param     {Object}    options
 * @return    {String}
 */
function link(key, options) {
  if (options.google && options.name) {
    return 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + otpauth(key, options.name);
  } else {
    return 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(key);
  }
}

/**
 * Creates a QR Code
 *
 * @param     {String}    key
 * @param     {Name}    name
 * @param     {Object}    options
 * @return    {Stream}
 */
function qrcode(key, name, issuer, options) {
  // Options
  options = _.extend({
    type: 'svg',
    sync: false
  }, options || {});

  var link = otpauth(key, name, issuer);

  if (options.sync) {
    return qr.imageSync(link, {
      type: options.type,
      margin: 0
    });
  } else {
    return qr.image(link, {
      type: options.type,
      margin: 0
    });
  }
}

/**
 * Generates a random base32 secret key and optionally a qrcode
 *
 * @param     {Object}    options
 * @return    {Object}
 */
function generateKey(options) {
  // Options
  options = _.extend({
    length: 32,
    name: '',
    symbols: false,
    google: false,
    qrCode: false,
    type: 'base32'
  }, options || {});

  // Generate the random string
  var key = randomString(options);

  if (options.type === 'ascii') {
    return key;
  } else if (options.type === 'base32') {
    // Encode the ascii string into base32 and remove any `=` signs which google
    // doesn't like
    key = base32.encode(key).toString().replace(/=/g, '');

    return key;
  } else {
    throw new Error('InvalidKeyType');
  }
}

/**
 * Public API
 *
 * @type    {Object}
 */
module.exports = {
  /**
   * Generates a link to a google chart of the qrcode
   *
   * @type    {Function}
   */
  link: link,

  /**
   * Generate a secret key
   *
   * @type    {Function}
   */
  key: generateKey,

  /**
   * Create a SVG QR Code
   *
   * @type    {Function}
   */
  qrcode: qrcode
};
