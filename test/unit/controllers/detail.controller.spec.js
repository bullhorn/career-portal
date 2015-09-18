// Mock the providers
beforeEach(() => {
    angular.mock.module(($provide) => {
        $provide.constant('configuration', {someUrl: '/dummyValue'});
        $provide.value('job', {});
    });
});

describe('Controller: JobDetailController', () => {
    let vm;

    beforeEach(angular.mock.module('CareerPortal'));

    beforeEach(inject(($controller) => {
        vm = $controller('JobDetailController');
    }));

    it('blah', () => {
        expect(true);
    });
});
