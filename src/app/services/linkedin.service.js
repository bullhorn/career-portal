class LinkedInService {
    constructor($rootScope) {
        'ngInject';

        this.linkedinUser = {};

        // Authenticate user
        if (IN.User) {
            IN.User.authorize(() => {
                let url = '/people/~:(id,first-name,last-name,formatted-name,location,positions,site-standard-profile-request,api-standard-profile-request,public-profile-url,skills,three-past-positions,educations,courses,publications,patents,languages,phone-numbers,main-address,im-accounts,twitter-accounts,email-address)?format=json';
                IN.API.Raw(url).method('GET').result((linkedinUser) => {
                    this.linkedinUser = linkedinUser;
                    $rootScope.$apply();
                });
            });
        }
    }
}
export default LinkedInService;
