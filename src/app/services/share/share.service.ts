import { Injectable } from '@angular/core';

@Injectable()
export class ShareService {

  private requestParams: any;

  constructor() {
    this.requestParams = {
      additionalEmailInfo: (job: any) => '?subject=' + encodeURIComponent(job.title) + '&body=' + this.description(job, window.location.href) + this.additionalEmailInfo(job),
      facebook: () => '?display=popup&app_id=' + this.config.keys.facebook + '&href=' + encodeURIComponent(window.location.href) + '&redirect_uri=' + encodeURIComponent('https://www.facebook.com/') + '&source=facebook',
      twitter: (job: any) => '?text=' + encodeURIComponent(this.description(job)) + '&url=' + encodeURIComponent(window.location.href) + '&source=twitter',
      linkedin: (job: any) => '?mini=true&source=Bullhorn%20Career%20Portal&title=' + encodeURIComponent(this.description(job)) + '&url=' + encodeURIComponent(window.location.href) + '&source=linkedin',
      email: (job: any) => '?subject=' + encodeURIComponent(job.title) + '&body=' + this.description(job, window.location.href),
    };
  }

  get config(): any {
    return {
      url: {
        facebook: 'https://www.facebook.com/dialog/share',
        twitter: 'https://twitter.com/intent/tweet',
        linkedin: 'https://www.linkedin.com/shareArticle',
      },
      keys: {
        facebook: '1439597326343190',
      },
    };
  }

  public emailLink(job: any): any {
    return 'mailto:' + this.requestParams.email(job);
  }

  public facebook(job: any): any {
    window.open(this.config.url.facebook + this.requestParams.facebook(job));
  }

  public linkedin(job: any): any {
    window.open(this.config.url.linkedin + this.requestParams.linkedin(job));
  }

  public sendEmailLink(job: any, email: any): any {
    email = email || '';
    return 'mailto:' + email + this.requestParams.additionalEmailInfo(job);
  }

  public twitter(job: any): any {
    window.open(this.config.url.twitter + this.requestParams.twitter(job));
  }

  private additionalEmailInfo(job: any): any {
    let body: any = '\n';
    if (job.title) {
      body += '\nTitle: Jobs';
    }

    if (job.publishedCategory && job.publishedCategory.name) {
      body += '\n' + 'Category: ' + job.publishedCategory.name;
    }

    if (job.address) {
      let location: any = '\n' + 'Location: ';
      if (job.address.city && job.address.state) {
        body += location + job.address.city + ', ' + job.address.state + '\n';
      } else if (job.address.city) {
        body += location + job.address.city + '\n';
      } else if (job.address.state) {
        body += location + job.address.state + '\n';
      }
    }
    return encodeURIComponent(body);
  }

  private description(job: any, url?: any): any {
    if (url) {
      return 'Check out this ' + encodeURIComponent(job.title) + ' job: ' + encodeURIComponent(url);
    }
    return 'Check out this ' + encodeURIComponent(job.title) + ' job!';
  }

}
