// Mock the providers
beforeEach(() => {
    angular.mock.module(($provide) => {
        $provide.constant('configuration', {someUrl: '/dummyValue'});
        $provide.value('job', {});
    });
});

describe('Factory: SharedData', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    it('should be registered', inject(SharedData => {
        expect(SharedData).not.toEqual(null);
    }));
});
