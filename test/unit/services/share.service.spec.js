// Mock the providers
describe('Service: ShareService', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    beforeEach(() => {
        angular.mock.module(($provide) => {
            $provide.constant('configuration', {someUrl: '/dummyValue'});
        });
    });

    let ShareService,
        job;

    beforeEach(inject(($injector) => {
        ShareService = $injector.get('ShareService');
        job = {
            title: 'My Job Title',
            publishedCategory: {
                name: 'Category Name'
            },
            address: {
                city: 'Topeka',
                state: 'KS'
            }
        };
    }));

    it('should be registered', () => {
        expect(ShareService).not.toEqual(null);
    });

    //need to mock this.locale.getString()
    describe('Function: sendEmailLink', () => {

        xit('should insert empty string after mailto: if the email field is undefined', () => {
            let emailLink = ShareService.sendEmailLink(job, undefined);
            expect(emailLink).toContain('mailto:?subject=My%20Job%20Title');
        });

        xit('should insert empty string after mailto: if the email field is null', () => {
            let emailLink = ShareService.sendEmailLink(job, null);
            expect(emailLink).toContain('mailto:?subject=My%20Job%20Title');
        });

        xit('should insert the email address after mailto:', () => {
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).toContain('mailto:example@test.com?subject=My%20Job%20Title');
        });

        xit('should not display the location if city and state are null', () => {
            job.address = {};
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).not.toContain('Location:');
        });

        xit('should only display the state if the city is null', () => {
            job.address.city = '';
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).toContain('Location%3A%20Kansas');
        });

        xit('should only display the city if the state is null', () => {
            job.address.state = '';
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).toContain('Location%3A%20Topeka');
        });

        xit('should display the category', () => {
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).toContain('Category%3A%20Category%20Name');
        });

        xit('should not display the category if it is null', () => {
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).not.toContain('Category');
        });
    });
});
