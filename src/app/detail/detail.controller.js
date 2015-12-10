class JobDetailController {
    /* jshint -W072 */
    constructor($window, $location, ShareService, SearchService, SharedData, job, detectUtils) {
        'ngInject';

        this.$window = $window;
        this.$location = $location;
        this.SharedData = SharedData;
        this.ShareService = ShareService;
        this.SearchService = SearchService;
        this.job = job;
        this.isIOS = detectUtils.isIOS();
        this.email = '';

        this.emailLink(this.job);

        // Load the related jobs
        this.loadRelatedJobs();

        // Set the view state
        this.SharedData.viewState = 'overview-open';
    }
    /* jshint +W072 */

    //sendEmailLink() {
    //    return this.ShareService.sendEmailLink(this.job, this.email);
    //}

    shareFacebook(job) {
        return this.ShareService.facebook(job);
    }

    shareTwitter(job) {
        return this.ShareService.twitter(job);
    }

    shareLinkedin(job) {
        return this.ShareService.linkedin(job);
    }

    emailLink(job) {
        return this.ShareService.emailLink(job);
    }

    print() {
        this.$window.print();
    }

    applyModal() {
        this.SharedData.modalState = 'open';
    }

    openShare() {
        this.open = this.open === false;

        if (!this.open) {
            this.share = 'share-open';
        } else {
            this.share = '';
        }
    }

    addRelatedJobs() {
        var controller = this;

        return function (jobs) {
            controller.relatedJobs = controller.relatedJobs.concat(jobs);
        };
    }

    loadRelatedJobs() {
        this.relatedJobs = [];

        if (this.job.publishedCategory) {
            this.SearchService.loadJobDataByCategory(this.job.publishedCategory.id, this.addRelatedJobs(), undefined, this.job.id);
        }
    }

    loadJobsWithCategory(categoryID) {
        this.SearchService.helper.emptyCurrentDataList();
        this.SearchService.helper.resetStartAndTotal();
        this.SearchService.helper.clearSearchParams();

        this.SearchService.searchParams.category.push(categoryID);

        this.SearchService.findJobs();

        this.$location.path('/jobs');
    }
}

export default JobDetailController;
