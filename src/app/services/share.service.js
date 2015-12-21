class ShareService {
    constructor(locale) {
        'ngInject';

        this.locale = locale;
    }

    get _() {
        return this.__ || (this.__ = Object.create(null, {}));
    }

    get config() {
        return {
            url: {
                facebook: 'https://www.facebook.com/dialog/share',
                twitter: 'https://twitter.com/intent/tweet',
                linkedin: 'https://www.linkedin.com/shareArticle'
            },
            keys: {
                facebook: '1439597326343190'
            }
        };
    }

    get requestParams() {
        return this._.requestParams || (this._.requestParams = {
                additionalEmailInfo: job => '?subject=' + encodeURIComponent(job.title) + '&body=' + this.description(job, window.location.href) + this.additionalEmailInfo(job),
                facebook: () => '?display=popup&app_id=' + this.config.keys.facebook + '&href=' + encodeURIComponent(window.location.href) + '&redirect_uri=' + encodeURIComponent('https://www.facebook.com/'),
                twitter: job => '?text=' + encodeURIComponent(this.description(job)) + '&url=' + encodeURIComponent(window.location.href),
                linkedin: job => '?mini=true&source=Bullhorn%20Carrer%20Portal&title=' + encodeURIComponent(this.description(job)) + '&url=' + encodeURIComponent(window.location.href),
                email: job => '?subject=' + encodeURIComponent(job.title) + '&body=' + this.description(job, window.location.href)
            });
    }

    additionalEmailInfo(job) {
        var body = '\n';
        if (job.title) {
            body += '\nTitle: ' + this.locale.getString('common.jobsLabel');
        }

        if (job.publishedCategory && job.publishedCategory.name) {
            body += '\n' + this.locale.getString('common.categorySectionHeading') + ': ' + job.publishedCategory.name;
        }

        if (job.address) {
            var location = '\n' + this.locale.getString('common.locationSectionHeading') + ': ';
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

    description(job, url) {
        if (url) {
            return 'Check out this ' + job.title + ' job: ' + encodeURIComponent(url);
        }
        return 'Check out this ' + job.title + ' job!';
    }

    emailLink(job) {
        return 'mailto:' + this.requestParams.email(job);
    }

    facebook(job) {
        window.open(this.config.url.facebook + this.requestParams.facebook(job));
    }

    linkedin(job) {
        window.open(this.config.url.linkedin + this.requestParams.linkedin(job));
    }

    sendEmailLink(job, email) {
        email = email || '';
        return 'mailto:' + email + this.requestParams.additionalEmailInfo(job);
    }

    twitter(job) {
        window.open(this.config.url.twitter + this.requestParams.twitter(job));
    }
}

export default ShareService;
