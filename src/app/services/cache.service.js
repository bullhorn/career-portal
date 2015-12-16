class CacheService {
    constructor() {
        try {
            this.hasLocalStorage = typeof Storage !== 'undefined';
            localStorage.setItem('test', 1);
            localStorage.removeItem('test');
        } catch (e) {
            this.hasLocalStorage = false;
        }
    }

    getItem(key) {
        if (this.hasLocalStorage) {
            var value = JSON.parse(localStorage.getItem(key));
            if (value) {
                return value;
            }
            return null;
        }
    }

    putItem(key, value) {
        if (this.hasLocalStorage) {
            localStorage.setItem(key, JSON.stringify(value));
            return value;
        }
    }

    deleteItem(key) {
        if (this.hasLocalStorage) {
            localStorage.removeItem(key);
            return true;
        }
    }

    clearStorage() {
        if (this.hasLocalStorage) {
            localStorage.clear();
        }
    }

}
export default CacheService;
