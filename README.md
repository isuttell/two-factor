# two-factor

Two factor authentication using totp or hotp. Can also generate dynamic qrcodes for mobile devices.

## Basic Usage: TOTP (Time-based One Time Password)

```js
var TwoFactor = require('two-factor');

/**
 * Generates a base 32 secret key. Each user should have their own stored someplace safe. This is like a users password.
 *
 * @type    {String}
 */
var secret = TwoFactor.generate.key();

/**
 * Code supplied from a token generator such as Google Authenticator
 *
 * @type    {Number}
 */
var code = req.body.code; // 123456

/**
 * Check to see if a user supplied code matches their secret
 *
 * @type    {Boolean}
 */
var isValid = TwoFactor.verify(code, secret);
```


## QR Codes

The library also can generate qr codes that can be read by mobile applications. The following example shows how to create a svg string that can rendered directly in a page.

```js
/**
 * Generates a SVG String that can be render in the browser
 *
 * @type    {String}
 */
var code = auth.generate.qrcode('user_secret', 'Description', {
    /**
     * Create a SVG
     *
     * @type    {String}
     */
    type: 'svg',

    /**
     * Create it Syncronously
     *
     * @type    {Boolean}
     */
    sync: true
});
```
