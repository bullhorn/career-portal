import { browser, by, element } from 'protractor';

export class AppPage {
  public navigateTo(): any {
    return browser.get('/');
  }

  public getParagraphText(): any {
    return element(by.css('app-root h1')).getText();
  }
}
