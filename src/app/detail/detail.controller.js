class JobDetailController {
    /* jshint -W072 */
    constructor($window, $location, $log, ShareService, SearchService, SharedData, job, configuration, MobileDetection, VerifyLI) {
        'ngInject';
        // NG Dependencies
        this.$window = $window;
        this.$location = $location;
        this.$log = $log;

        // Dependencies
        this.SharedData = SharedData;
        this.ShareService = ShareService;
        this.SearchService = SearchService;
        this.job = job;
        this.configuration = configuration;
        //this.MobileDetection = MobileDetection;

        // Variables
        this.isIOS = MobileDetection.browserData.os.ios;
        this.isIOSSafari = (this.isIOS && MobileDetection.browserData.browser.safari);
        this.isLinkedInEnabled = VerifyLI.verified;
        this.email = '';
        this.relatedJobs = [];
        this.SharedData.viewState = 'overview-open';

        // Init functions
        this.loadRelatedJobs();
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

    isMaskedDevice() {
        return (this.isIOSSafari || (!this.isLinkedInEnabled && this.isIOS));
    }

    loadJobsWithCategory (categoryID) {
        this.SearchService.helper.emptyCurrentDataList();
        this.SearchService.helper.resetStartAndTotal();
        this.SearchService.helper.clearSearchParams();
        this.SearchService.searchParams.category.push(categoryID);
        this.SearchService.findJobs();
        this.$location.path('/jobs');
    }
}

export default JobDetailController;
