class JobDetailController {
    /* jshint -W072 */
    constructor($rootScope, $window, $location, $log, ShareService, SearchService, SharedData, job, configuration, APPLIED_JOBS_KEY) {
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

        // Variables
        this.email = '';
        this.relatedJobs = [];
        this.SharedData.viewState = 'overview-open';
        this.APPLIED_JOBS_KEY = APPLIED_JOBS_KEY;
        this.alreadyApplied = false;
        // Init functions
        this.loadRelatedJobs();

        // Check session storage for already applied jobs
        this.checkSessionStorage();

        // Listen for ModalSuccess
        $rootScope.$on('ModalSuccess', angular.bind(this, function () {
            this.checkSessionStorage();
        }));
    }

    checkSessionStorage() {
        // Check session storage to see if this job was already applied to for this session
        let alreadyAppliedJobs = sessionStorage.getItem(this.APPLIED_JOBS_KEY);
        if (alreadyAppliedJobs) {
            let alreadyAppliedJobsArray = JSON.parse(alreadyAppliedJobs);
            this.alreadyApplied = (alreadyAppliedJobsArray.indexOf(this.job.id) !== -1);
        }
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
