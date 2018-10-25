// Mock the providers
describe('Controller: JobListController', () => {
    let vm;

    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.constant('configuration', {
                someUrl: '/dummyValue',
                service: {corpToken: 1, port: 1, swimlane: 1},
                additionalJobCriteria: {
                    field: '[ FILTER FIELD HERE ]',
                    values: [
                        '[ FILTER VALUE HERE ]'
                    ]
                }
            });
        });
    });

    beforeEach(angular.mock.module('CareerPortal'));

    beforeEach(inject(($controller) => {
        vm = $controller('JobListController');
    }));

    it('should have its dependencies and startup variables set.', () => {
        expect(vm.SearchService).toBeDefined();
        expect(vm.SharedData).toBeDefined();
        expect(vm.SharedData.viewState).toBe('overview-closed');
    });

    describe('Function: loadMoreData()', () => {
        it('should execute a search for more jobs and preserve existing data.', () => {
            spyOn(vm.SearchService, 'findJobs').and.callThrough();
            vm.loadMoreData();
            expect(vm.SearchService.searchParams.reloadAllData).toBeFalsy();
            expect(vm.SearchService.findJobs).toHaveBeenCalled();
        });
    });

    describe('Function: clearSearchParamsAndLoadData()', () => {
        it('should execute a search for more jobs and not preserve existing data.', () => {
            spyOn(vm.SearchService, 'findJobs').and.callThrough();
            spyOn(vm.SearchService.helper, 'clearSearchParams').and.callThrough();
            vm.clearSearchParamsAndLoadData();
            expect(vm.SearchService.searchParams.reloadAllData).toBeTruthy();
            expect(vm.SearchService.findJobs).toHaveBeenCalled();
            expect(vm.SearchService.helper.clearSearchParams).toHaveBeenCalled();
        });
    });
});
