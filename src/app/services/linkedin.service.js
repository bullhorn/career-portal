class LinkedInService {
    constructor($q, configuration, $window, SharedData) {
        'ngInject';
        this.$q = $q;
        this.$window = $window;

        this.userIsLoaded = false;
        this.configuration = configuration;
        this.SharedData = SharedData;
    }

    /**
     * Loads and initialized the LinkedIn API
     * @param {Promise} def - promise to be resolved when the user is returned from the API
     */
    loadAndInitializeApi(def) {
        var script = document.createElement('script'),
            prior = document.getElementsByTagName('script')[0];
        script.async = 1;
        prior.parentNode.insertBefore(script, prior);
        script.onload = script.onreadystatechange = (_, isAbort) => { // jshint ignore:line
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;
                script = undefined;

                // Set a callback function on the window for LinkedIn to call after the API is initialized
                this.$window.linkedInApiOnLoadCallback = () => {
                    this.getUser(def);
                    // Opens Modal when API information is loaded.
                    this.SharedData.modalState = 'open';
                };

                if (!isAbort) {
                    IN.init({
                        'api_key': this.configuration.integrations.linkedin.clientId,
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
