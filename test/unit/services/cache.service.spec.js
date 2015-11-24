describe('Service: CacheService', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    var CacheService,
        key = 'key',
        value = 'value';

    beforeEach(inject(_CacheService_ => {
        localStorage.clear();
        CacheService = _CacheService_;
    }));

    afterEach(() => {
        localStorage.clear();
    });

    it('should be registered', () => {
        expect(CacheService).not.toEqual(null);
    });

    describe('Function: getItem(key)', () => {
        it('should get an item from local storage.', () => {
            expect(CacheService.getItem(key)).toBeNull();
            expect(localStorage.getItem(key)).toBeNull();
            localStorage.setItem(key, JSON.stringify(value));
            expect(CacheService.getItem(key)).toBe(value);
        });
    });

    describe('Function: putItem(key, value)', () => {
        it('should get an item from local storage.', () => {
            expect(CacheService.getItem(key)).toBeNull();
            expect(localStorage.getItem(key)).toBeNull();
            CacheService.putItem(key, value);
            expect(CacheService.getItem(key)).toBe(value);
            expect(JSON.parse(localStorage.getItem(key))).toBe(value);
        });
    });

    describe('Function: deleteItem(key)', () => {
        it('should delete an item from local storage.', () => {
            CacheService.putItem(key, value);
            expect(CacheService.getItem(key)).toBe(value);
            expect(JSON.parse(localStorage.getItem(key))).toBe(value);
            CacheService.deleteItem(key);
            expect(CacheService.getItem(key)).toBeNull();
            expect(localStorage.getItem(key)).toBeNull();
        });
    });

    describe('Function: clearStorage()', () => {
        it('should delete all items from local storage.', () => {
            CacheService.putItem(key, value);
            expect(CacheService.getItem(key)).toBe(value);
            CacheService.clearStorage();
            expect(CacheService.getItem(key)).toBeNull();
            expect(localStorage.getItem(key)).toBeNull();
        });
    });


});
