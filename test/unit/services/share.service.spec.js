// Mock the providers
beforeEach(() => {
    angular.mock.module(($provide) => {
        $provide.constant('configuration', {someUrl: '/dummyValue'});
        $provide.value('job', {});
    });
});

describe('Service: ShareService', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    it('should be registered', inject(ShareService => {
        expect(ShareService).not.toEqual(null);
    }));

    describe('Function: sendEmailLink', () => {

        it('should insert empty string after mailto: if the email field is undefined', inject(ShareService => {
            let job = {
                title: 'My Job Title',
                publishedCategory: {
                    name: 'Category Name'
                },
                address: {
                    city: 'Topeka',
                    state: 'KS'
                }
            };
            let emailLink = ShareService.sendEmailLink(job, undefined);
            expect(emailLink).toContain('mailto:?subject=My%20Job%20Title');
        }));

        it('should insert empty string after mailto: if the email field is null', inject(ShareService => {
            let job = {
                title: 'My Job Title',
                publishedCategory: {
                    name: 'Category Name'
                },
                address: {
                    city: 'Topeka',
                    state: 'KS'
                }
            };
            let emailLink = ShareService.sendEmailLink(job, null);
            expect(emailLink).toContain('mailto:?subject=My%20Job%20Title');
        }));

        it('should insert the email address after mailto:', inject(ShareService => {
            let job = {
                title: 'My Job Title',
                publishedCategory: {
                    name: 'Category Name'
                },
                address: {
                    city: 'Topeka',
                    state: 'KS'
                }
            };
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).toContain('mailto:example@test.com?subject=My%20Job%20Title');
        }));
    });
});
