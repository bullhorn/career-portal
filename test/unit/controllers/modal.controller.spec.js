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

        // Note: while the output verification matters, the real benefit of these tests is knowing that the parser
        // function doesn't throw an undefined error

        it('should format a resume with all fields.', () => {
            var mockResume = {"emailAddress":"email@bullhorn.com","firstName":"John","formattedName":"John Stamos","lastName":"Stamos","location":{"country":{"code":"us"},"name":"Greater Boston Area"},"positions":{"_total":1,"values":[{"company":{"id":18144,"industry":"Computer Software","name":"Bullhorn","size":"501-1000 employees","type":"Privately Held"},"id":725128063,"isCurrent":true,"location":{"country":{"code":"us","name":"United States"},"name":"Greater Boston Area"},"startDate":{"month":10,"year":2015},"title":"Sr. Engineer"}]},"publicProfileUrl":"https://www.linkedin.com/in/stamosforreal","siteStandardProfileRequest":{"url":"https://www.linkedin.com/profile/view?id=datstamosthooo"}};
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe("John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\nEducation:\n\n\n");
            expect(vm.linkedInData.resume).toBe("Work Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\nSkills:\n*\n\n\n");
        });

        it('should format a resume without the location field.', () => {
            var mockResume = {"emailAddress":"email@bullhorn.com","firstName":"John","formattedName":"John Stamos","lastName":"Stamos","positions":{"_total":1,"values":[{"company":{"id":18144,"industry":"Computer Software","name":"Bullhorn","size":"501-1000 employees","type":"Privately Held"},"id":725128063,"isCurrent":true,"location":{"country":{"code":"us","name":"United States"},"name":"Greater Boston Area"},"startDate":{"month":10,"year":2015},"title":"Sr. Engineer"}]},"publicProfileUrl":"https://www.linkedin.com/in/stamosforreal","siteStandardProfileRequest":{"url":"https://www.linkedin.com/profile/view?id=datstamosthooo"}};
            vm.formatResume(mockResume);

            expect(vm.linkedInData.header).toBe("John Stamos\nemail@bullhorn.com\nEducation:\n\n\n");
            expect(vm.linkedInData.resume).toBe("Work Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\nSkills:\n*\n\n\n");
        });

        it('should format a resume without the country code field.', () => {
            var mockResume = {"emailAddress":"email@bullhorn.com","firstName":"John","formattedName":"John Stamos","lastName":"Stamos","location":{"name":"Greater Boston Area"},"positions":{"_total":1,"values":[{"company":{"id":18144,"industry":"Computer Software","name":"Bullhorn","size":"501-1000 employees","type":"Privately Held"},"id":725128063,"isCurrent":true,"location":{"country":{"code":"us","name":"United States"},"name":"Greater Boston Area"},"startDate":{"month":10,"year":2015},"title":"Sr. Engineer"}]},"publicProfileUrl":"https://www.linkedin.com/in/stamosforreal","siteStandardProfileRequest":{"url":"https://www.linkedin.com/profile/view?id=datstamosthooo"}};
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe("John Stamos\nemail@bullhorn.com\nGreater Boston Area, Education:\n\n\n");
            expect(vm.linkedInData.resume).toBe("Work Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\nSkills:\n*\n\n\n");
        });

        it('should format a resume without the  field.', () => {
            var mockResume = {"emailAddress":"email@bullhorn.com","firstName":"John","formattedName":"John Stamos","lastName":"Stamos","location":{"country":{"code":"us"},"name":"Greater Boston Area"},"positions":{"_total":1,"values":[]},"publicProfileUrl":"https://www.linkedin.com/in/stamosforreal","siteStandardProfileRequest":{"url":"https://www.linkedin.com/profile/view?id=datstamosthooo"}};
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe("John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\nEducation:\n\n\n");
            expect(vm.linkedInData.resume).toBe("Work Experience:\n\n\n\nSkills:\n*\n\n\n");
        });

        it('should format a resume without the positions field.', () => {
            var mockResume = {"emailAddress":"email@bullhorn.com","firstName":"John","formattedName":"John Stamos","lastName":"Stamos","location":{"country":{"code":"us"},"name":"Greater Boston Area"},"publicProfileUrl":"https://www.linkedin.com/in/stamosforreal","siteStandardProfileRequest":{"url":"https://www.linkedin.com/profile/view?id=datstamosthooo"}};
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe("John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\nEducation:\n\n\n");
            expect(vm.linkedInData.resume).toBe("Work Experience:\n\n\n\nSkills:\n*\n\n\n");
        });

        it('should format a resume without the email address and formatted name fields.', () => {
            var mockResume = {"formattedName":"John Stamos","lastName":"Stamos","location":{"country":{"code":"us"},"name":"Greater Boston Area"},"positions":{"_total":1,"values":[{"company":{"id":18144,"industry":"Computer Software","name":"Bullhorn","size":"501-1000 employees","type":"Privately Held"},"id":725128063,"isCurrent":true,"location":{"country":{"code":"us","name":"United States"},"name":"Greater Boston Area"},"startDate":{"month":10,"year":2015},"title":"Sr. Engineer"}]},"publicProfileUrl":"https://www.linkedin.com/in/stamosforreal","siteStandardProfileRequest":{"url":"https://www.linkedin.com/profile/view?id=datstamosthooo"}};
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe("John Stamos\n\nGreater Boston Area, US\n\n\nEducation:\n\n\n");
            expect(vm.linkedInData.resume).toBe("Work Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\nSkills:\n*\n\n\n");
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
