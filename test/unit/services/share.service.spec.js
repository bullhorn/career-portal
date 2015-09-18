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
});
