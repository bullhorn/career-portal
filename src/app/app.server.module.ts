import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule, initSettings } from './app.module';
import { AppComponent } from './app.component';
import { ServerTranslationLoader } from './services/localization/server-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TransferState } from '@angular/platform-browser';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: TranslateLoader, useClass: ServerTranslationLoader, deps: [TransferState]},
  ],
})
export class AppServerModule {}
