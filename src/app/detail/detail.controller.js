class JobDetailController {
    /* jshint -W072 */
    constructor($window, $location, ShareService, SearchService, SharedData, job, detectUtils, configuration) {
        'ngInject';

        this.$window = $window;
        this.$location = $location;
        this.SharedData = SharedData;
        this.ShareService = ShareService;
        this.SearchService = SearchService;
        this.job = job;
        this.isIOS = detectUtils.isIOS();
        this.email = '';
        this.configuration = configuration;

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
        let categoryId = this.job.publishedCategory.id,
            jobId = this.job.id;
        this.SearchService.loadJobDataByCategory(categoryId, jobId)
            .then(data => {
                this.relatedJobs = data;
            });
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
        return !!this.configuration.integrations.linkedin;
    }
}

export default JobDetailController;
