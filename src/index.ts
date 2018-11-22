import { isBrowser, isNode } from 'browser-or-node';
import * as OAuth from 'oauth-1.0a';

import { IOptions } from './options';

export default class GoodreadsClient {
  private options: IOptions;
  private oauthClient: OAuth;

  constructor(options?: IOptions) {
    this.options = options;

    if (this.options.callback && this.options.secret) {
      this.oauthClient = new OAuth({
        consumer: {
          key: this.options.key,
          secret: this.options.secret,
        },
        signature_method: 'HMAC_SHA1',
        hash_function(baseString, key) {
          if (isNode) {
            const crypto = require('crypto');

            return crypto
              .createHmac('sha1', key)
              .update(baseString)
              .digest('base64');
          } else if (isBrowser) {
            if (!CyptoJS || typeof CryptoJS.HmacSHA1 !== 'function') {
              throw new Error('CryptoJS is required for OAuth calls');
            }

            return CryptoJS.HmacSHA1(baseString, key).toString(
              CryptoJS.enc.Base64,
            );
          } else {
            throw new Error('Unknown environment');
          }
        },
      });
    }
  }

  public config(options: IOptions) {
    this.options = options;
  }

  private processResponse(response) {}
}
