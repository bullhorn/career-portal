class OmitFilters {
    constructor() {
        return function (collection, type, params) {
            if (!angular.isArray(collection) || angular.isUndefined(type)) {
                return collection;
            }

            return collection.filter(function (element) {
                let isChecked = false;
                if (type === 'location') {
                    isChecked = params ? params.indexOf(element.address.city + '|' + element.address.state) >= 0 : false;
                } else {
                    isChecked = params ? params.indexOf(element.publishedCategory.id) >= 0 : false;
                }
                return element.idCount !== 0 || isChecked;
            });
        };
    }
}

export default OmitFilters;
