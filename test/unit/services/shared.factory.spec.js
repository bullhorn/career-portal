// Mock the providers
describe('Factory: SharedData', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    let SharedData;

    beforeEach(() => {
        angular.mock.module(($provide) => {
            $provide.constant('configuration', {someUrl: '/dummyValue'});
        });
    });

    beforeEach(inject(($injector) => {
        SharedData = $injector.get('SharedData');
    }));

    it('should be registered', () => {
        expect(SharedData).toBeDefined();
    });

    describe('Function: viewState()', function () {
        it('should be defined.', function () {
            expect(SharedData.viewState).toBeDefined();
        });
    });

    describe('Function: gridState()', function () {
        it('should be defined.', function () {
            expect(SharedData.gridState).toBeDefined();
        });
    });

    describe('Function: modalState()', function () {
        it('should be defined.', function () {
            expect(SharedData.modalState).toBeDefined();
        });
    });

    describe('Function: filtersApplied()', function () {
        it('should be defined.', function () {
            expect(SharedData.filtersApplied).toBeDefined();
        });
    });
});
