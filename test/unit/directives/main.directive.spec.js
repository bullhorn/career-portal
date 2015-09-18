//// Mock the providers
//beforeEach(() => {
//    angular.mock.module(($provide) => {
//        $provide.constant('configuration', {someUrl: '/dummyValue'});
//        $provide.value('job', {})
//    });
//});
//
//describe('Directive: Main', () => {
//    let vm;
//    let element;
//
//    beforeEach(angular.mock.module('CareerPortal'));
//
//    beforeEach(inject(($compile, $rootScope) => {
//
//        element = angular.element(`
//            <main></main>
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
