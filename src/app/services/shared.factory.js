class SharedData {
    constructor() {
    }

    get _() {
        return this.__ || (this.__ = Object.create(null, {}));
    }

    get viewState() {
        return this._.viewState || 'overview-closed';
    }

    set viewState(value) {
        this._.viewState = value;
    }

    get gridState() {
        return this._.gridState || 'list-view';
    }

    set gridState(value) {
        this._.gridState = value;
    }

    get modalState() {
        return this._.modalState || 'closed';
    }

    set modalState(value) {
        this._.modalState = value;
    }

    get filtersApplied() {
        return this._.filtersApplied || 0;
    }

    set filtersApplied(value) {
        this._.filtersApplied = value;
    }
}

export default SharedData;