// Mock the providers
describe('Controller: CareerPortalModalController', () => {
    let vm;

    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.constant('configuration', { someUrl: '/dummyValue', service: { corpToken: 1, port: 1, swimlane: 1 }, integrations: { linkedin: '' }, acceptedResumeTypes: [ "html", "text", "txt" ] });
        });
    });


    beforeEach(angular.mock.module('CareerPortal'));

    beforeEach(inject(($controller) => {
        vm = $controller('CareerPortalModalController');
    }));

    it('should have all of its dependencies defined.', () => {

        // NG Dependencies
        expect(vm.$location).toBeDefined();
        expect(vm.$window).toBeDefined();
        expect(vm.$filter).toBeDefined();
        expect(vm.$log).toBeDefined();

        // Other Dependencies
        expect(vm.configuration).toBeDefined();
        expect(vm.SharedData).toBeDefined();
        expect(vm.SearchService).toBeDefined();
        expect(vm.ShareService).toBeDefined();
        expect(vm.ApplyService).toBeDefined();
        expect(vm.LinkedInService).toBeDefined();
        expect(vm.locale).toBeDefined();

        // Variables
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
        it('should call getUser on the LinkedInService and set the hasAttemptedLIApply flag to true.', () => {
            spyOn(vm.LinkedInService, 'getUser').and.callThrough();
            vm.applyWithLinkedIn();
            expect(vm.LinkedInService.getUser).toHaveBeenCalled();
            expect(vm.hasAttemptedLIApply).toBeTruthy();
        });
    });

    describe('Function: closeModal(applyForm)', () => {
        it('should be defined.', () => {
            expect(vm.closeModal).toBeDefined();
        });
        it('should reset close the modal and clear all modal data.', () => {
            vm.SharedData.modalState = 'open';
            vm.showForm = false;
            vm.hasAttemptedLIApply = true;
            vm.closeModal();
            expect(vm.SharedData.modalState).toBe('closed');
            expect(vm.showForm).toBeTruthy();
            expect(vm.hasAttemptedLIApply).toBeFalsy();
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

    describe('Function: enableSendButton()', () => {
        it('should be defined.', () => {
            expect(vm.enableSendButton).toBeDefined();
        });
    });

    describe('Function: getTooltipText()', () => {
        it('should be defined.', () => {
            expect(vm.getTooltipText).toBeDefined();
        });
        it('should build out an unordered list of supported file types.', () => {
            var tooltipHTML = vm.getTooltipText();
            expect(tooltipHTML).toBe('<ul><li>html</li><li>text</li><li>txt</li></ul>');
            vm.configuration.acceptedResumeTypes = ['html'];
            tooltipHTML = vm.getTooltipText();
            expect(tooltipHTML).toBe('<ul><li>html</li></ul>');
        });

    });

    describe('Function: formatResume(userProfile)', () => {
        it('should be defined.', () => {
            expect(vm.formatResume).toBeDefined();
        });

        // Begin a million cases... *sigh*
        it('should format a resume with all fields.', () => {

        });

        it('should format a resume without the  field.', () => {

        });

        it('should format a resume without the  field.', () => {

        });

        it('should format a resume without the  field.', () => {

        });

        it('should format a resume without the  field.', () => {

        });

        it('should format a resume without the  field.', () => {

        });

        it('should format a resume without the  field.', () => {

        });

        it('should format a resume without the  field.', () => {

        });

        it('should format a resume without the  field.', () => {

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
