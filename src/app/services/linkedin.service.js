class LinkedInService {
    constructor($q) {
        'ngInject';
        this.$q = $q;
        this.userIsLoaded = false;
    }

    getUser () {
        var deferred = this.$q.defer();
        // Authenticate user
        if (typeof IN !== 'undefined') {
            IN.User.authorize(() => {
                let url = '/people/~:(id,email-address,first-name,last-name,formatted-name,location,positions,site-standard-profile-request,api-standard-profile-request,public-profile-url,skills,three-past-positions,educations,courses,publications,patents,languages,phone-numbers,main-address,im-accounts,twitter-accounts)?format=json';
                IN.API.Raw(url).method('GET')
                    .result((linkedinUser) => {
                        deferred.resolve(linkedinUser);
                        this.userIsLoaded = true;
                    });
            });
        } else {
            deferred.reject({message: 'LinkedIn JS dependency was not loaded properly.'});
        }
        return deferred.promise;
    }

    isUserLoaded () {
        return this.userIsLoaded;
    }
}
export default LinkedInService;
