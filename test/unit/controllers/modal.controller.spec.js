// Mock the providers
describe('Controller: CareerPortalModalController', () => {
    let vm;

    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.constant('configuration', { someUrl: '/dummyValue', service: { corpToken: 1, port: 1, swimlane: 1 }, integrations: { linkedin: '' } });
        });
    });

    beforeEach(angular.mock.module('CareerPortal'));

    beforeEach(inject(($controller) => {
        vm = $controller('CareerPortalModalController');
    }));

    it('should have all of its dependencies defined.', () => {
        expect(vm.SharedData).toBeDefined();
        expect(vm.$location).toBeDefined();
        expect(vm.SearchService).toBeDefined();
        expect(vm.$window).toBeDefined();
        expect(vm.ShareService).toBeDefined();
        expect(vm.ApplyService).toBeDefined();
        expect(vm.LinkedInService).toBeDefined();
        expect(vm.configuration).toBeDefined();
        expect(vm.locale).toBeDefined();
        expect(vm.$filter).toBeDefined();
        expect(vm.isMobile).toBeDefined();
        expect(vm.email).toBeDefined();
        expect(vm.hasAttemptedLIApply).toBeFalsy();
        expect(vm.linkedInData.header).toBeDefined();
        expect(vm.linkedInData.resume).toBeDefined();
        expect(vm.linkedInData.footer).toBeDefined();
    });


    describe('Function: applyWithLinkedIn()', () => {
        it('should be defined.', () => {
            expect(vm.applyWithLinkedIn).toBeDefined();
        });
    });

    describe('Function: closeModal(applyForm)', () => {
        it('should be defined.', () => {
            expect(vm.closeModal).toBeDefined();
        });
    });

    describe('Function: validateResume(file)', () => {
        it('should be defined.', () => {
            expect(vm.validateResume).toBeDefined();
        });
    });

    describe('Function: updateUploadClass(valid)', () => {
        it('should be defined.', () => {
            expect(vm.updateUploadClass).toBeDefined();
        });
    });

    describe('Function: showSendButton()', () => {
        it('should be defined.', () => {
            expect(vm.showSendButton).toBeDefined();
        });
    });

    describe('Function: getTooltipText()', () => {
        it('should be defined.', () => {
            expect(vm.getTooltipText).toBeDefined();
        });
    });

    describe('Function: formatResume(userProfile)', () => {
        it('should be defined.', () => {
            expect(vm.formatResume).toBeDefined();
        });
    });

    describe('Function: applySuccess()', () => {
        it('should be defined.', () => {
            expect(vm.applySuccess).toBeDefined();
        });
    });

    describe('Function: submit(applyForm)', () => {
        it('should be defined.', () => {
            expect(vm.submit).toBeDefined();
        });
    });

    describe('Function: verifyLinkedInIntegration()', () => {
        it('should be defined.', () => {
            expect(vm.verifyLinkedInIntegration).toBeDefined();
        });
    });

});
