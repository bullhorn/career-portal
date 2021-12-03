import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule, initSettings } from './app.module';
import { AppComponent } from './app.component';
import { ServerTranslationLoader } from './services/localization/server-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SettingsService } from './services/settings/settings.service';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: ServerTranslationLoader,
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initSettings, deps: [SettingsService], multi: true },
  ],
})
export class AppServerModule {}
