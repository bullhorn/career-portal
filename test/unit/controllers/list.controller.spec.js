// Mock the providers
beforeEach(() => {
    angular.mock.module(($provide) => {
        $provide.constant('configuration', {someUrl: '/dummyValue'});
        $provide.value('job', {});
    });
});

describe('Controller: JobListController', () => {
    let vm;

    beforeEach(angular.mock.module('CareerPortal'));

    beforeEach(inject(($controller) => {
        vm = $controller('JobListController');
    }));

    it('TODO', () => {
        expect(true);
    });
});
