class LinkedInService {
    constructor($q, configuration) {
        'ngInject';
        this.$q = $q;
        this.userIsLoaded = false;
        this.configuration = configuration;
    }

    /**
     * Loads and initialized the LinkedIn API
     * @param {Promise} def - promise to be resolved when the user is returned from the API
     */
    loadAndInitializeApi(def) {
        var script = document.createElement('script');
        var prior = document.getElementsByTagName('script')[0];
        script.async = 1;
        prior.parentNode.insertBefore(script, prior);

        var that = this;
        script.onload = script.onreadystatechange = function (_, isAbort) { // jshint ignore:line
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;
                script = undefined;

                // Set a callback function on the window for LinkedIn to call after the API is initialized
                window.linkedInApiOnLoadCallback = function () {
                    that.getUser(def);
                };

                if (!isAbort) {
                    IN.init({
                        'api_key': that.configuration.integrations.linkedin.clientId,
                        onLoad: 'linkedInApiOnLoadCallback'
                    });
                }
            }
        };

        script.src = '//platform.linkedin.com/in.js?async=true';
    }

    getUser(deferred) {
        var def = deferred || this.$q.defer();
        // Authenticate user
        if (typeof IN !== 'undefined') {
            IN.User.authorize(() => {
                let url = '/people/~:(id,email-address,first-name,last-name,formatted-name,location,positions,site-standard-profile-request,api-standard-profile-request,public-profile-url,skills,three-past-positions,educations,courses,publications,patents,languages,phone-numbers,main-address,im-accounts,twitter-accounts)?format=json';
                IN.API.Raw(url).method('GET')
                    .result((linkedinUser) => {
                        def.resolve(linkedinUser);
                        this.userIsLoaded = true;
                    });
            });
        } else {
            this.loadAndInitializeApi(def);
        }
        return def.promise;
    }

    isUserLoaded() {
        return this.userIsLoaded;
    }
}
export default LinkedInService;
