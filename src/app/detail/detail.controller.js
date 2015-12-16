class JobDetailController {
    /* jshint -W072 */
    constructor($window, $location, ShareService, SearchService, SharedData, job, detectUtils, configuration, $log) {
        'ngInject';

        // Dependencies
        this.$window = $window;
        this.$location = $location;
        this.SharedData = SharedData;
        this.ShareService = ShareService;
        this.SearchService = SearchService;
        this.$log = $log;
        this.job = job;
        this.isIOS = detectUtils.isIOS();
        this.configuration = configuration;

        // Constants
        this.email = '';
        this.relatedJobs = [];

        // Load the related jobs
        this.loadRelatedJobs();

        // Set the view state
        this.SharedData.viewState = 'overview-open';
    }
    /* jshint +W072 */

    sendEmailLink() {
        return this.ShareService.sendEmailLink(this.job, this.email);
    }

    shareFacebook() {
        this.ShareService.facebook(this.job);
    }

    shareTwitter() {
        this.ShareService.twitter(this.job);
    }

    shareLinkedin() {
        this.ShareService.linkedin(this.job);
    }

    emailLink() {
        return this.ShareService.emailLink(this.job);
    }

    print() {
        this.$window.print();
    }

    applyModal() {
        this.SharedData.modalState = 'open';
    }

    loadRelatedJobs() {
        let job = this.job || {},
            category = job.publishedCategory || {},
            categoryId = category.id ? category.id : '',
            jobId = job.id;

        if (categoryId || jobId) {
            this.SearchService.loadJobDataByCategory(categoryId, jobId)
                .then(data => {
                    this.relatedJobs = data;
                });
        } else {
            this.$log.error('No job or category was provided.');
        }


    }

    loadJobsWithCategory (categoryID) {
        this.SearchService.helper.emptyCurrentDataList();
        this.SearchService.helper.resetStartAndTotal();
        this.SearchService.helper.clearSearchParams();
        this.SearchService.searchParams.category.push(categoryID);
        this.SearchService.findJobs();
        this.$location.path('/jobs');
    }

    verifyLinkedInIntegration () {
        var clientId = this.configuration.integrations.linkedin.clientId || '';
        if (clientId === '' || clientId === '[ CLIENTID HERE ]' || clientId.length !== 14) {
            return false;
        }
        return true;
    }
}

export default JobDetailController;
