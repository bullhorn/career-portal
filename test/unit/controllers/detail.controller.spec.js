// Mock the providers
describe('Controller: JobDetailController', () => {
    let vm;

    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.constant('configuration', {
                someUrl: '/dummyValue',
                service: {corpToken: 1, port: 1, swimlane: 1},
                additionalJobCriteria: {
                    field: '[ FILTER FIELD HERE ]',
                    values: [
                        '[ FILTER VALUE HERE ]'
                    ]
                }
            });
        });
    });

    var $log;

    beforeEach(angular.mock.module('CareerPortal'));

    beforeEach(inject(($controller, $injector) => {
        vm = $controller('JobDetailController', {
            job: {publishedCategory: {id: 1}, id: 1}
        });

        $log = $injector.get('$log');

    }));

    it('should have all of its dependencies defined.', () => {
        // NG Dependencies
        expect(vm.$window).toBeDefined();
        expect(vm.$location).toBeDefined();
        expect(vm.$log).toBeDefined();

        // Dependencies
        expect(vm.SharedData).toBeDefined();
        expect(vm.ShareService).toBeDefined();
        expect(vm.SearchService).toBeDefined();
        expect(vm.job).toBeDefined();
        expect(vm.configuration).toBeDefined();

        // Variables
        expect(vm.SharedData.viewState).toBe('overview-open');
        expect(vm.email).toBeDefined();
        expect(vm.relatedJobs).toBeDefined();
        expect(vm.APPLIED_JOBS_KEY).toBeDefined();
        expect(vm.alreadyApplied).toBeDefined();

    });

    describe('Function: checkSessionStorage()', () => {

        beforeAll(() => {
            let mockAppliedJobs = [1];
            sessionStorage.setItem('APPLIED_JOBS_KEY', JSON.stringify(mockAppliedJobs));
        });

        it('should be defined.', () => {
            expect(vm.checkSessionStorage).toBeDefined();
        });

        it('should set the alreadyApplied boolean to true if a job has been applied to', () => {
            vm.job = {
                id: 1
            };
            vm.checkSessionStorage();
            expect(vm.alreadyApplied).toBeTruthy();
        });

        it('should set the alreadyApplied boolean to false if a job has not been applied to', () => {
            vm.job = {
                id: 2
            };
            vm.checkSessionStorage();
            expect(vm.alreadyApplied).toBeFalsy();
        });
    });

    describe('Function: shareFacebook()', () => {
        it('should be defined.', () => {
            expect(vm.shareFacebook).toBeDefined();
        });
        it('should call the ShareService.facebook method.', () => {
            spyOn(vm.ShareService, 'facebook').and.callThrough();
            vm.shareFacebook();
            expect(vm.ShareService.facebook).toHaveBeenCalled();
        });
    });

    describe('Function: shareTwitter()', () => {
        it('should be defined.', () => {
            expect(vm.shareTwitter).toBeDefined();
        });
        it('should call the ShareService.twitter method.', () => {
            spyOn(vm.ShareService, 'twitter').and.callThrough();
            vm.shareTwitter();
            expect(vm.ShareService.twitter).toHaveBeenCalled();
        });
    });

    describe('Function: shareLinkedin()', () => {
        it('should be defined.', () => {
            expect(vm.shareLinkedin).toBeDefined();
        });
        it('should call the ShareService.linkedin method.', () => {
            spyOn(vm.ShareService, 'linkedin').and.callThrough();
            vm.shareLinkedin();
            expect(vm.ShareService.linkedin).toHaveBeenCalled();
        });
    });

    describe('Function: emailLink()', () => {
        it('should be defined.', () => {
            expect(vm.emailLink).toBeDefined();
        });
        it('should call the ShareService.sendEmailLink method & return a `mailto:` url.', () => {
            spyOn(vm.ShareService, 'emailLink').and.callThrough();
            var link = vm.emailLink(vm.job);
            expect(vm.ShareService.emailLink).toHaveBeenCalled();
            expect(link.indexOf('mailto:')).toBe(0);
        });
    });

    describe('Function: print()', () => {
        it('should be defined.', () => {
            expect(vm.print).toBeDefined();
        });
        it('should call the $window.print method.', () => {
            spyOn(vm.$window, 'print').and.callThrough();
            vm.print();
            expect(vm.$window.print).toHaveBeenCalled();
        });
    });

    describe('Function: applyModal()', () => {
        it('should be defined.', () => {
            expect(vm.applyModal).toBeDefined();
        });
        it('should set the SharedData.modalState equal to `open`.', () => {
            vm.applyModal();
            expect(vm.SharedData.modalState).toBe('open');
        });
    });

    describe('Function: loadRelatedJobs()', () => {
        it('should be defined.', () => {
            expect(vm.loadRelatedJobs).toBeDefined();
        });
        it('should call SearchService.loadJobDataByCategory and return related jobs.', () => {
            spyOn(vm.SearchService, 'loadJobDataByCategory').and.callThrough();
            vm.loadRelatedJobs();
            expect(vm.SearchService.loadJobDataByCategory).toHaveBeenCalled();
        });
        it('should not fail if the job is defined without a publishedCategory.', () => {
            vm.job = {id: 1, publishedCategory: null};
            spyOn(vm.SearchService, 'loadJobDataByCategory').and.callThrough();
            vm.loadRelatedJobs();
            expect(vm.SearchService.loadJobDataByCategory).toHaveBeenCalled();
        });
        it('should fail if the job isn\'t defined.', () => {
            vm.job = null;
            spyOn(vm.$log, 'error').and.callThrough();
            vm.loadRelatedJobs();
            expect(vm.$log.error).toHaveBeenCalledWith('No job or category was provided.');
        });
    });

    describe('Function: loadJobsWithCategory(categoryID)', () => {
        it('should be defined.', () => {
            expect(vm.loadJobsWithCategory).toBeDefined();
        });
        it('should clear the SearchService queue, find new jobs, and show the jobs view.', () => {
            var fakeCategory = 'derp';
            spyOn(vm.SearchService.helper, 'emptyCurrentDataList').and.callThrough();
            spyOn(vm.SearchService.helper, 'resetStartAndTotal').and.callThrough();
            spyOn(vm.SearchService.helper, 'clearSearchParams').and.callThrough();
            spyOn(vm.SearchService, 'findJobs').and.callThrough();
            spyOn(vm.$location, 'path').and.callThrough();
            vm.loadJobsWithCategory(fakeCategory);
            expect(vm.SearchService.helper.emptyCurrentDataList).toHaveBeenCalled();
            expect(vm.SearchService.helper.resetStartAndTotal).toHaveBeenCalled();
            expect(vm.SearchService.searchParams.category.indexOf(fakeCategory)).not.toBe(-1);
            expect(vm.SearchService.findJobs).toHaveBeenCalled();
            expect(vm.SearchService.helper.emptyCurrentDataList).toHaveBeenCalled();
            expect(vm.$location.path).toHaveBeenCalledWith('/jobs');
        });
    });
});
