
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Inject, Injectable, Optional } from '@angular/core';
import { Response } from 'express';
import * as ms from 'ms';
import { SettingsService } from '../settings/settings.service';
@Injectable({
  providedIn: 'root',
})
export class ServerResponseService {

  private response: Response;

  constructor(@Optional() @Inject(RESPONSE) response: any) {
    this.response = response;
  }

  public getHeader(key: string): string {
    return this.response.getHeader(key) as string;
  }

  public setHeader(key: string, value: string): this {
    if (this.response) {
      this.response.header(key, value);
    }
    return this;
  }

  public appendHeader(key: string, value: string, delimiter: string = ','): this {
    if (this.response) {
      const current: string = this.getHeader(key);
      if (!current) {
        return this.setHeader(key, value);
      }

      const newValue: any = [...current.split(delimiter), value]
        .filter((el: any, i: any, a: any) => i === a.indexOf(el))
        .join(delimiter);

      this.response.header(key, newValue);
    }
    return this;
  }

  public setHeaders(dictionary: { [key: string]: string }): this {
    if (this.response) {
      Object.keys(dictionary).forEach((key: string) => this.setHeader(key, dictionary[key]));
    }
    return this;
  }

  public setStatus(code: number, message?: string): this {
    if (this.response) {
      this.response.statusCode = code;
      if (message) {
        this.response.statusMessage = message;
      }
    }
    return this;
  }

  public setNotFound(message: string = 'not found'): this {
    if (SettingsService.isServer) {
      this.response.status(404);
      this.response.statusMessage = message;
    }
    return this;
  }

  public setUnauthorized(message: string = 'Unauthorized'): this {
    if (this.response) {
      this.response.statusCode = 401;
      this.response.statusMessage = message;
    }
    return this;
  }

  public setCachePrivate(): this {
    if (this.response) {
      this.setCache('private');
    }
    return this;
  }

  public setCacheNone(): this {
    if (this.response) {
      this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      this.setHeader('Pragma', 'no-cache');
    }
    return this;
  }

  public setCache(directive: HttpCacheDirective, maxAge?: string, smaxAge?: string): this {
    if (this.response) {
      // tslint:disable-next-line:max-line-length
      if (smaxAge) {
        this.setHeader('Cache-Control', `${directive}, max-age=${maxAge ? ms(maxAge) / 1000 : 0}, s-maxage=${ms(smaxAge) / 1000}`);
      } else {
        this.setHeader('Cache-Control', `${directive}, max-age=${maxAge ? ms(maxAge) / 1000 : 0}`);
      }

      this.setHeader('Expires', maxAge ? new Date(Date.now() + ms(maxAge)).toUTCString() : new Date(Date.now()).toUTCString());
    }
    return this;
  }

  public setError(message: string = 'internal server error'): this {
    if (this.response) {
      this.response.statusCode = 500;
      this.response.statusMessage = message;
    }
    return this;
  }

}

export type HttpCacheDirective = 'public' | 'private' | 'no-store' | 'no-cache' | 'must-revalidate' | 'no-transform' | 'proxy-revalidate';
