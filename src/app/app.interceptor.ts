import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(@Optional() @Inject(REQUEST) protected request: Request) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): any {
    let serverReq: HttpRequest<any> = req;
    if (this.request && req.url.includes('./app.json')) {
      let newUrl: string = `${this.request.protocol}://${this.request.get('host')}`;
      if (!req.url.startsWith('/')) {
        newUrl += '/';
      }
      newUrl += 'app.json';
      serverReq = req.clone({ url: newUrl });
    }
    return next.handle(serverReq);
  }
}
