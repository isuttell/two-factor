/*******************************************************************************
 * Auth
 *
 * @author       Isaac Suttell <isaac@isaacsuttell.com>
 * @file         Library to generate one time passwords. To use, generate a key
 *               using `generateKey` and save it in a db for the user. This is
 *               also used to setup a authenticator such as Google
 *               Authenticator.Google Authenticator can scan the
 *               qrcode so the the user doesnt have to manually input it. Then
 *               When the user logs in require them to entire the code and
 *               compare it to the result of `totp`
 ******************************************************************************/

module.exports = {
  /**
   * Generates a one time code based on a key and number, ie, time
   *
   * @type    {Function}
   */
  hotp: require('./lib/hotp'),

  /**
   * Generates a one time code based on a key and the current time using `hotp`
   *
   * @type    {Function}
   */
  totp: require('./lib/totp'),

  /**
   * Verify a code is correct
   *
   * @type    {Function}
   */
  verify: require('./lib/verify'),

  /**
   * Generates a random base32 key and qrcode links
   *
   * @type    {Object} {}
   */
  generate: require('./lib/generate')
};
