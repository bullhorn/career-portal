class JobDetailController {
    constructor($window, $location, ShareService, SearchService, SharedData, job, moment) {
        'ngInject';

        this.moment = moment;
        this.$window = $window;
        this.$location = $location;
        this.SharedData = SharedData;
        this.ShareService = ShareService;
        this.SearchService = SearchService;
        this.job = job;

        // Load the related jobs
        this.loadRelatedJobs();

        // Set the view state
        this.SharedData.viewState = 'overview-open';
    }

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

    getDisplayDate(date) {
        var momentDate = this.moment(date);
        var now = moment();

        if (now.diff(momentDate, 'days') > 1) {
            return momentDate.format('MM/DD/YY h:mm a');
        }
        return momentDate.fromNow();
    }
}

export default JobDetailController;