// Mock the providers
beforeEach(() => {
    angular.mock.module(($provide) => {
        $provide.constant('configuration', {someUrl: '/dummyValue'});
        $provide.value('job', {});
    });
});

describe('Service: SearchService', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    it('should be registered', inject(SearchService => {
        expect(SearchService).not.toEqual(null);
    }));
});
