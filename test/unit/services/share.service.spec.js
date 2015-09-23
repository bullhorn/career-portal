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

    //need to mock this.locale.getString()
    xdescribe('Function: sendEmailLink', () => {

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

        it('should not display the location if city and state are null', inject(ShareService => {
            let job = {
                title: 'My Job Title',
                publishedCategory: {
                    name: 'Category Name'
                },
                address: {
                    city: null,
                    state: null
                }
            };
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).not.toContain('Location:');
        }));

        it('should only display the state if the city is null', inject(ShareService => {
            let job = {
                title: 'My Job Title',
                publishedCategory: {
                    name: 'Category Name'
                },
                address: {
                    city: null,
                    state: 'Kansas'
                }
            };
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).toContain('Location%3A%20Kansas');
        }));

        it('should only display the city if the state are null', inject(ShareService => {
            let job = {
                title: 'My Job Title',
                publishedCategory: {
                    name: 'Category Name'
                },
                address: {
                    city: 'Topeka',
                    state: null
                }
            };
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).toContain('Location%3A%20Topeka');
        }));

        it('should display the category', inject(ShareService => {
            let job = {
                title: 'My Job Title',
                publishedCategory: {
                    name: 'Category Name'
                }
            };
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).toContain('Category%3A%20Category%20Name');
        }));

        it('should not display the category if it is null', inject(ShareService => {
            let job = {
                title: 'My Job Title',
                publishedCategory: {
                    name: null
                },
                address: {
                    city: null,
                    state: null
                }
            };
            let emailLink = ShareService.sendEmailLink(job, 'example@test.com');
            expect(emailLink).not.toContain('Category');
        }));
    });
});
