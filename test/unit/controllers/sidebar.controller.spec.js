// Mock the providers
describe('Controller: CareerPortalSidebarController', () => {
    let vm,
        $controller,
        expectedResult,
        subject,
        input,
        category,
        location,
        defaultConfig,
        rootScope;

    beforeEach(() => {
        defaultConfig = {
            someUrl: '/dummyValue',
            service: {corpToken: 1, port: 1, swimlane: 1},
            integrations: {linkedin: {clientId: ''}},
            defaultGridState: 'grid-view'
        };
    });
    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.constant('configuration', defaultConfig);
        });
    });

    beforeEach(angular.mock.module('CareerPortal'));

    beforeEach(inject(($injector, $rootScope) => {
        $controller = $injector.get('$controller');
        rootScope = $rootScope;
        vm = $controller('CareerPortalSidebarController', {
            $scope: rootScope.$new()
        });
    }));

    it('should have all of its dependencies defined.', () => {
        // NG Dependencies
        expect(vm.$location).toBeDefined();
        expect(vm.$timeout).toBeDefined();

        // Dependencies
        expect(vm.SharedData).toBeDefined();
        expect(vm.SearchService).toBeDefined();
        expect(vm.configuration).toBeDefined();

        // Variables
        expect(vm.configuration.defaultGridState).toBe('grid-view');
        expect(vm.SharedData.gridState).toBe('grid-view');
        expect(vm.locationLimitTo).toBe(8);
        expect(vm.categoryLimitTo).toBe(8);
    });
    it('should handle invalid configuration for defaultGridState(invalid config)', () => {
        defaultConfig.defaultGridState = 'bad-config-here';
        vm = $controller('CareerPortalSidebarController', {
            $scope: rootScope.$new(),
            configuration: defaultConfig
        });
        expect(vm.SharedData.gridState).toBe('list-view');
    });
    it('should handle invalid configuration for defaultGridState(null value)', () => {
        defaultConfig.defaultGridState = null;
        vm = $controller('CareerPortalSidebarController', {
            $scope: rootScope.$new(),
            configuration: defaultConfig
        });
        expect(vm.SharedData.gridState).toBe('list-view');
    });
    it('should handle defaultGridState set to "list-view"', () => {
        defaultConfig.defaultGridState = 'list-view';
        vm = $controller('CareerPortalSidebarController', {
            $scope: rootScope.$new(),
            configuration: defaultConfig
        });
        expect(vm.SharedData.gridState).toBe('list-view');
    });
    describe('Function: updateLocationLimitTo(value)', () => {
        it('should update the location limit', () => {
            vm.updateLocationLimitTo(22);
            expect(vm.locationLimitTo).toBe(22);
        });
        it('should be defined', () => {
            expect(vm.updateLocationLimitTo).toBeDefined();
        });
    });
    describe('Function: updateCategoryLimitTo(value)', () => {
        it('should update the category limit', () => {
            vm.updateLocationLimitTo(12);
            expect(vm.locationLimitTo).toBe(12);
        });
        it('should be defined', () => {
            expect(vm.updateCategoryLimitTo).toBeDefined();
        });
    });
    describe('Function: setLocations()', () => {
        beforeEach(() => {
            expectedResult = [{
                    address: {
                        city: 'Clayton',
                        state: 'MO'
                    }
                },{
                    address: {
                        city: 'Boston',
                        state: 'MA'
                    }
            }];
            subject = vm.setLocations();
        });
        it('should be defined', () => {
            expect(vm.setLocations).toBeDefined();
        });
        it('should update the locations', () => {
            subject(expectedResult);
            expect(vm.locations).toEqual(expectedResult);
        });
        it('should filter out locations with no city', () => {
            input = expectedResult.slice(0);
            input.push({address:{state:'KS'}});
            subject(input);
            expect(vm.locations).toEqual(expectedResult);
        });
        it('should filter out locations with no state', () => {
            input = expectedResult.slice(0);
            input.push({address:{city:'Topeka'}});
            subject(input);
            expect(vm.locations).toEqual(expectedResult);
        });
    });
    describe('Function: setCategories()', () => {
        beforeEach(() => {
            expectedResult = [{
                    publishedCategory: {
                        name: 'Clayton'
                    }
                },{
                    publishedCategory: {
                        name: 'Boston'
                    }
            }];
            subject = vm.setCategories();
        });
        it('should be defined', () => {
            expect(vm.setCategories).toBeDefined();
        });
        it('should update the categories', () => {
            subject(expectedResult);
            expect(vm.categories).toEqual(expectedResult);
        });
        it('should filter out categories with no publishedCategory.name', () => {
            input = expectedResult.slice(0);
            input.push({publishedCategory:null});
            subject(input);
            expect(vm.categories).toEqual(expectedResult);
        });
        it('should filter out categories where publishedCategory.name is empty string', () => {
            input = expectedResult.slice(0);
            input.push({publishedCategory:{name:''}});
            subject(input);
            expect(vm.categories).toEqual(expectedResult);
        });
    });
    describe('Function: updateCountsByIntersection(oldCounts, newCounts, getID, getLabel)', () => {
        it('should be defined', () => {
            expect(vm.updateCountsByIntersection).toBeDefined();
        });
    });
    describe('Function: updateFilterCounts()', () => {
        it('should be defined', () => {
            expect(vm.updateFilterCounts).toBeDefined();
        });
    });
    describe('Function: updateFilterCountsAnonymous()', () => {
        it('should be defined', () => {
            expect(vm.updateFilterCountsAnonymous).toBeDefined();
        });
    });
    describe('Function: switchViewStyle', () => {
        it('should be defined', () => {
            expect(vm.switchViewStyle).toBeDefined();
        });
        it('should update SharedData.gridState', () => {
            vm.switchViewStyle('myNewViewStyle');
            expect(vm.SharedData.gridState).toBe('myNewViewStyle-view');
        });
    });
    describe('Function: searchJobs()', () => {
        it('should be defined', () => {
            expect(vm.searchJobs).toBeDefined();
        });
    });
    describe('Function: clearSearchParamsAndLoadData(param)', () => {
        it('should be defined', () => {
            expect(vm.clearSearchParamsAndLoadData).toBeDefined();
        });
    });
    describe('Function: goBack()', () => {
        it('should be defined', () => {
            expect(vm.goBack).toBeDefined();
        });
    });
    describe('Function: searchOnDelay()', () => {
        it('should be defined', () => {
            expect(vm.searchOnDelay).toBeDefined();
        });
    });
    describe('Function: addOrRemoveLocation(location)', () => {
        beforeEach(() => {
            vm.searchJobs = () => {};
            /* jshint ignore:start */
            location = {
                address: {
                    city: 'MyCity',
                    state: 'MyState'
                }
            };
            /* jshint ignore:end */
        });
        it('should be defined', () => {
            expect(vm.addOrRemoveLocation).toBeDefined();
        });
        it('should add a location', () => {
            vm.addOrRemoveLocation(location);
            expect(vm.SearchService.searchParams.location).toEqual(['MyCity|MyState']);
        });
        it('should remove a location if it is already in the searchParams', () => {
            vm.SearchService.searchParams.location.push('MyCity|MyState');
            vm.SearchService.searchParams.location.push('AnotherCity|AnotherState');
            vm.addOrRemoveLocation(location);
            expect(vm.SearchService.searchParams.location).toEqual(['AnotherCity|AnotherState']);
        });
    });
    describe('Function: addOrRemoveCategory(category)', () => {
        beforeEach(() => {
            vm.searchJobs = () => {};
            category = {
                publishedCategory: {
                    id: 123
                }
            };
        });
        it('should be defined', () => {
            expect(vm.addOrRemoveCategory).toBeDefined();
        });
        it('should add a category', () => {
            vm.addOrRemoveCategory(category);
            expect(vm.SearchService.searchParams.category).toEqual([123]);
        });
        it('should remove a category if it is already in the searchParams', () => {
            vm.SearchService.searchParams.category.push(123);
            vm.SearchService.searchParams.category.push(456);
            vm.addOrRemoveCategory(category);
            expect(vm.SearchService.searchParams.category).toEqual([456]);
        });
    });
    describe('Function: hasLocationFilter(location)', () => {
        beforeEach(() => {
            vm.searchJobs = () => {};
            /* jshint ignore:start */
            location = {
                address: {
                    city: 'MyCity',
                    state: 'MyState'
                }
            };
            /* jshint ignore:end */
        });
        it('should be defined', () => {
            expect(vm.hasLocationFilter).toBeDefined();
        });
        it('should return true if location is in SearchService.searchParams.location', () => {
            vm.SearchService.searchParams.location.push('MyCity|MyState');
            vm.SearchService.searchParams.location.push('DifferentCity|DifferentState');
            expect(vm.hasLocationFilter(location)).toBe(true);
        });
        it('should return false if location is not in SearchService.searchParams.location', () => {
            vm.SearchService.searchParams.location.push('DifferentCity|DifferentState');
            expect(vm.hasLocationFilter(location)).toBe(false);
        });
    });
    describe('Function: hasCategoryFilter(category)', () => {
        beforeEach(() => {
            vm.searchJobs = () => {};
            category = {
                publishedCategory: {
                    id: 55
                }
            };
        });
        it('should be defined', () => {
            expect(vm.hasCategoryFilter).toBeDefined();
        });
        it('should return true if category is in SearchService.searchParams.category', () => {
            vm.SearchService.searchParams.category.push(55);
            vm.SearchService.searchParams.category.push(13);
            expect(vm.hasCategoryFilter(category)).toBe(true);
        });
        it('should return false if category is not in SearchService.searchParams.category', () => {
            vm.SearchService.searchParams.category.push(12);
            expect(vm.hasCategoryFilter(category)).toBe(false);
        });
    });
});
