describe('Service: SearchService', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    let SearchService;

    beforeEach(() => {
        angular.mock.module(($provide) => {
            $provide.constant('configuration', {someUrl: '/dummyValue'});
            //$provide.value('job', {});
        });
    });

    beforeEach(inject(($injector) => {
        SearchService = $injector.get('SearchService');
    }));

    it('should be registered', () => {
        expect(SearchService).toBeDefined();
    });

    describe('Function: currentDetailData()', () => {
        it('should be defined.', () => {
            expect(SearchService.currentDetailData).toBeDefined();
        });
    });

    describe('Function: currentListData()', () => {
        it('should be defined.', () => {
            expect(SearchService.currentListData).toBeDefined();
        });
    });

    describe('Function: helper()', () => {
        it('should be defined.', () => {
            expect(SearchService.helper).toBeDefined();
        });
    });

    describe('Function: requestParams()', () => {
        it('should be defined.', () => {
            expect(SearchService.requestParams).toBeDefined();
        });
    });

    describe('Function: searchParams()', () => {
        it('should be defined.', () => {
            expect(SearchService.searchParams).toBeDefined();
        });
    });

    describe('Function: getCountByLocation()', () => {
        it('should be defined.', () => {
            expect(SearchService.getCountByLocation).toBeDefined();
        });
    });

    describe('Function: getCountByCategory()', () => {
        it('should be defined.', () => {
            expect(SearchService.getCountByCategory).toBeDefined();
        });
    });

    describe('Function: getCountWhereIDs()', () => {
        it('should be defined.', () => {
            expect(SearchService.getCountWhereIDs).toBeDefined();
        });
    });

    describe('Function: recursiveSearchForIDs()', () => {
        it('should be defined.', () => {
            expect(SearchService.recursiveSearchForIDs).toBeDefined();
        });
    });

    describe('Function: getCountBy()', () => {
        it('should be defined.', () => {
            expect(SearchService.getCountBy).toBeDefined();
        });
    });

    describe('Function: searchWhereIDs()', () => {
        it('should be defined.', () => {
            expect(SearchService.searchWhereIDs).toBeDefined();
        });
    });

    describe('Function: recursiveQueryForIDs()', () => {
        it('should be defined.', () => {
            expect(SearchService.recursiveQueryForIDs).toBeDefined();
        });
    });

    describe('Function: findJobs()', () => {
        it('should be defined.', () => {
            expect(SearchService.findJobs).toBeDefined();
        });
    });

    describe('Function: loadJobData()', () => {
        it('should be defined.', () => {
            expect(SearchService.loadJobData).toBeDefined();
        });
    });

    describe('Function: loadJobDataByCategory()', () => {
        it('should be defined.', () => {
            expect(SearchService.loadJobDataByCategory).toBeDefined();
        });
    });
});
