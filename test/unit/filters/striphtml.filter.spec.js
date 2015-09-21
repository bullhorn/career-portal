// Mock the providers
beforeEach(() => {
    angular.mock.module(($provide) => {
        $provide.constant('configuration', {someUrl: '/dummyValue'});
        $provide.value('job', {});
    });
});

describe('Filter: StripHTML', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    it('TODO', () => {
        expect(true);
    });
});
