describe('Service: SearchService', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    let SearchService;

    beforeEach(() => {
        angular.mock.module(($provide) => {
            $provide.value('configuration',
            {
                someUrl: '/dummyValue',
                additionalJobCriteria: {
                    field: '[ FILTER FIELD HERE ]',
                    values: [
                        '[ FILTER VALUE HERE ]'
                    ],
                    sort: "-dateLastPublished"
                }
            });
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

    describe('Function: recursiveSearchForJobs()', () => {
        it('should be defined.', () => {
            expect(SearchService.recursiveSearchForJobs).toBeDefined();
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

    describe('Function: jobCriteria()', () => {
        it('should return string for search', () => {
            SearchService.configuration = {
                additionalJobCriteria: {
                    field: 'employmentType',
                    values: [
                        'blah'
                    ],
                    sort: "-dateLastPublished"
                },
            };
            expect(SearchService.jobCriteria(true)).toBe(' AND (employmentType:"blah")');
        });
        it('should return longer string for search', () => {
            SearchService.configuration = {
                additionalJobCriteria: {
                    field: 'employmentType',
                    values: [
                        'blah',
                        'blahy'
                    ],
                    sort: "-dateLastPublished"
                },
            };
            expect(SearchService.jobCriteria(true)).toBe(' AND (employmentType:"blah" OR employmentType:"blahy")');
        });
        it('should return blank string if no config is set', () => {
            SearchService.configuration = {
                additionalJobCriteria: {
                    field: '[ FILTER FIELD HERE ]',
                    values: [
                        '[ FILTER VALUE HERE ]'
                    ],
                    sort: "-dateLastPublished"
                },
            };
            expect(SearchService.jobCriteria(true)).toBe('');
        });
        it('should return differently if not a search', () => {
            SearchService.configuration = {
                additionalJobCriteria: {
                    field: 'employmentType',
                    values: [
                        'blah'
                    ],
                    sort: "-dateLastPublished"
                },
            };
            expect(SearchService.jobCriteria(false)).toBe(' AND (employmentType=\'blah\')');
        });
    });
});
