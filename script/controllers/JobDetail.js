import 'angular';

export default [
    '$rootScope',
    '$location',
    '$routeParams',
    '$route',
    '$scope',
    'searchData',
    'shareSocial',
    class {

        constructor() {
            this.$rootScope = arguments[0];
            this.$location = arguments[1];
            this.$routeParams = arguments[2];
            this.$route = arguments[3];
            this.$scope = arguments[4];

            this.handleScope(arguments[5]);

            this.initialize(arguments[6]);
        }

        //#region Properties

        get _() {
            return this.__ || (this.__ = Object.create(null, {}));
        }

        //#endregion

        //#region Methods

        handleScope(searchData) {
            this.$rootScope.viewState = 'overview-open';

            this.$scope.searchService = searchData;
            this.$scope.jobId = this.$routeParams.id;
        }

        initialize(shareSocial) {
            this.shareFacebook = (job) => shareSocial.facebook(job);
            this.shareTwitter = (job) => shareSocial.twitter(job);
            this.shareLinkedin = (job) => shareSocial.linkedin(job);
            this.shareEmail = (job) => shareSocial.email(job);

            this.open = true;

            if (!this.$scope.searchService.currentDetailData.id) {
                this.loadJob(this.$scope.jobId);
            } else {
                this.$scope.jobData = this.$scope.searchService.currentDetailData;

                this.loadRelatedJobs();
            }
        }

        goBack() {
            this.$location.path('/jobs');
        }

        switchToJob(jobID) {
            this.loadJob(jobID);
        }

        applyModal() {
            this.$rootScope.modalState = 'open';
        }

        openShare() {
            this.open = this.open === false ? true : false;

            if (!this.open) {
                this.share = 'share-open';
            } else {
                this.share = '';
            }
        }

        addRelatedJobs() {
            var controller = this;

            return function(jobs) {
                controller.$scope.relatedJobs = controller.$scope.relatedJobs.concat(jobs);
            };
        }

        loadRelatedJobs() {
            this.$scope.relatedJobs = [];


            if (this.$scope.jobData.publishedCategory) {
                this.$scope.searchService.loadJobDataByCategory(this.$scope.jobData.publishedCategory.id, this.addRelatedJobs(), undefined,
                    this.$scope.jobData.id);
            }
        }


        loadJobsWithCategory(categoryID) {
            this.$scope.searchService.helper.emptyCurrentDataList();
            this.$scope.searchService.helper.resetStartAndTotal();
            this.$scope.searchService.helper.clearSearchParams();

            this.$scope.searchService.searchParams.category.push(categoryID);

            this.$scope.searchService.makeSearchApiCall();

            this.goBack();
        }

        successfulLoadJob(job) {
            this.$scope.jobId = job.id;

            this.$scope.jobData = job;

            this.loadRelatedJobs();
        }

        loadJob(jobID) {
            var controller = this;

            this.$scope.searchService.loadJobData(jobID, function(job) {
                controller.$scope.searchService.currentDetailData = job;

                controller.$location.path('/jobs/' + jobID);

                if(!controller.$scope.jobID) {
                    controller.successfulLoadJob(job);
                }
            }, function() {
                controller.goBack();
            });
        }

        //#endregion
    }
];