// Mock the providers
describe('Controller: JobDetailController', () => {
    let vm;

    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.constant('configuration', { someUrl: '/dummyValue', service: { corpToken: 1, port: 1, swimlane: 1 }, integrations: { linkedin: { clientId: '' } } });
        });
    });

    var $log;

    beforeEach(angular.mock.module('CareerPortal'));

    beforeEach(inject(($controller, $injector) => {
        vm = $controller('JobDetailController', {
            job: { publishedCategory : { id: 1 }, id: 1 }
        });

        $log = $injector.get('$log');

    }));

    it('should have all of its dependencies defined.', () => {
        expect(vm.$window).toBeDefined();
        expect(vm.$location).toBeDefined();
        expect(vm.SharedData).toBeDefined();
        expect(vm.ShareService).toBeDefined();
        expect(vm.SearchService).toBeDefined();
        expect(vm.job).toBeDefined();
        expect(vm.isIOS).toBeDefined();
        expect(vm.email).toBeDefined();
        expect(vm.configuration).toBeDefined();
        expect(vm.SharedData.viewState).toBe('overview-open');
        expect(vm.relatedJobs).toBeDefined();
    });

    // TODO: splitting hairs, but wouldn't getEmailLink be a better name?
    describe('Function: sendEmailLink()', () => {
        it('should be defined.', () => {
            expect(vm.sendEmailLink).toBeDefined();
        });
        it('should call the ShareService.sendEmailLink method.', () => {
            spyOn(vm.ShareService, 'sendEmailLink').and.callThrough();
            vm.sendEmailLink();
            expect(vm.ShareService.sendEmailLink).toHaveBeenCalled();
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
            vm.job = { id: 1, publishedCategory: null };
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

    describe('Function: verifyLinkedInIntegration()', () => {
        it('should return true if the clientId is defined and 14 characters.', () => {
            vm.configuration.integrations.linkedin.clientId = '00000000000000';
            expect(vm.verifyLinkedInIntegration()).toBeTruthy();
        });
        it('should return false if the clientId is defined and not 14 characters.', () => {
            vm.configuration.integrations.linkedin.clientId = '11111';
            expect(vm.verifyLinkedInIntegration()).toBeFalsy();
        });
        it('should return false if the clientId is not defined.', () => {
            vm.configuration.integrations.linkedin.clientId = '';
            expect(vm.verifyLinkedInIntegration()).toBeFalsy();
        });

        it('should return false if the clientId is null.', () => {
            vm.configuration.integrations.linkedin.clientId = null;
            expect(vm.verifyLinkedInIntegration()).toBeFalsy();
        });

        it('should return false if the clientId is `[ CLIENTID HERE ]`.', () => {
            vm.configuration.integrations.linkedin.clientId = '[ CLIENTID HERE ]';
            expect(vm.verifyLinkedInIntegration()).toBeFalsy();
        });
    });
});
