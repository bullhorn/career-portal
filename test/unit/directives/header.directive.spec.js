//// Mock the providers
//beforeEach(() => {
//    angular.mock.module(($provide) => {
//        $provide.constant('configuration', {someUrl: '/dummyValue'});
//        $provide.value('job', {})
//    });
//});
//
//describe('Directive: CareerPortalHeader', () => {
//    let vm;
//    let element;
//
//    beforeEach(angular.mock.module('CareerPortal'));
//
//    beforeEach(inject(($compile, $rootScope) => {
//
//        element = angular.element(`
//            <career-portal-header></career-portal-header>
//        `);
//
//        $compile(element)($rootScope.$new());
//        $rootScope.$digest();
//        vm = element.isolateScope().vm;
//    }));
//
//    it('should be compiled', () => {
//        expect(element.html()).not.toEqual(null);
//    });
//});


// TODO
//beforeEach(function () {
//    module('ngLocalize');
//
//    inject(function ($injector) {
//        // Set up the mock http service responses
//        _httpBackend = $injector.get('$httpBackend');
//        // backend definition common for all tests
//        _httpBackend.whenGET('languages/en-US/common.lang.json').respond({
//            helloWorld: 'Hello World',
//            fullName: 'My name is {firstName} {lastName}',
//            htmlToken: '<b>Hello World!</b>',
//            'key with spaces': 'some string value'
//        });
//
//        // force our service to pull down the required resource file
//        $injector.get('locale').ready('common');
//        _httpBackend.flush();
//    });
//});
