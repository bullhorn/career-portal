export default [
    class {

        //#region Properties

        /**
        * A dictionary that contains the collective state of a ShareSocial instance.
        * 
        * @private
        * @returns { Object }
        */
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
                    facebook: '821471654606643'
                }
            };
        }

        get requestParams() {
            return this._.requestParams || (this._.requestParams = {
                facebook: () => '?display=popup&app_id=' + this.config.keys.facebook + '&href=' + encodeURIComponent(window.location.href) + '&redirect_uri=' + encodeURIComponent(window.location.href),
                twitter: job => '?text=' + this.description(job) + '&url=' + encodeURIComponent(window.location.href),
                linkedin: job => '?mini=true&source=Bullhorn%20Carrer%20Portal&title=' + this.description(job) + '&url=' + encodeURIComponent(window.location.href),
                email: job => '?subject=' + job.title + '&body=' + this.description(job, window.location.href)
            });
        }

        //#endregion

        //#region Methods

        description(job, url) {
            if (url)
                return 'Check out this ' + job.title + ' job: ' + encodeURIComponent(url);

            return 'Check out this ' + job.title + ' job!';
        }

        email(job) {
            window.open('mailto:' + this.requestParams.email(job));
        }

        facebook(job) {
            window.open(this.config.url.facebook + this.requestParams.facebook(job));
        }

        linkedin(job) {
            window.open(this.config.url.linkedin + this.requestParams.linkedin(job));
        }

        twitter(job) {
            window.open(this.config.url.twitter + this.requestParams.twitter(job));
        }

        //#endregion

    }
];
