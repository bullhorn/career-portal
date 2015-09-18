// Mock the providers
beforeEach(() => {
    angular.mock.module(($provide) => {
        $provide.constant('configuration', {someUrl: '/dummyValue'});
        $provide.value('job', {});
    });
});

describe('Service: ApplyService', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    it('should be registered', inject(ApplyService => {
        expect(ApplyService).not.toEqual(null);
    }));
});
