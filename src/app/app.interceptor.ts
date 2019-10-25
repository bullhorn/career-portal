import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { SettingsService } from './services/settings/settings.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(@Optional() @Inject(REQUEST) protected request: Request) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): any {
    let serverReq: HttpRequest<any> = req;
    let port: string = '80';
    let host: string = 'localhost';
    if (this.request && req.url.includes('app.json')) {
      if (SettingsService.isServer && this.request.headers.host.indexOf(':') !== -1 ) {
        port = this.request.headers.host.split(':')[1];
        host = this.request.headers.host.split(':')[0];
      } else if (SettingsService.isServer && this.request.path === '/') {
        host = this.request.headers.host;
      } else if (SettingsService.isServer && this.request.headers.host) {
        host = this.request.headers.host;
        port = '';
      }
      let newUrl: string = `http://${host}:${port}`;
      if (!req.url.startsWith('/')) {
        newUrl += '/';
      }
      SettingsService.urlRoot = newUrl;
      newUrl += 'app.json';
      serverReq = req.clone({ url: newUrl });
    }

    return next.handle(serverReq);
  }
}
