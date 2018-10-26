class SearchService {
    constructor($http, configuration, $q) {
        'ngInject';
        this.$http = $http;
        this.configuration = configuration;
        this.$q = $q;
    }

    static get _() {
        return SearchService.__ || (SearchService.__ = Object.create(null));
    }

    static get _count() {
        return SearchService._.pageSize || (SearchService._.pageSize = 20);
    }

    static get _fields() {
        return SearchService._.fields || (SearchService._.fields = 'id,title,publishedCategory(id,name),address(city,state),employmentType,dateLastPublished,publicDescription,isOpen,isPublic,isDeleted');
    }

    get _() {
        return this.__ || (this.__ = Object.create(null));
    }

    get currentDetailData() {
        return this._.currentDetailData || (this._.currentDetailData = {});
    }

    set currentDetailData(value) {
        this._.currentDetailData = value;
    }

    get currentListData() {
        return this._.currentListData || (this._.currentListData = []);
    }

    set currentListData(value) {
        this._.currentListData = value;
    }

    get helper() {
        return this._.helper || (this._.helper = {
                hasMore: true,
                emptyCurrentDataList: () => this.currentListData.length = 0,
                updateStart: (count) => {
                    if (count) {
                        this.searchParams.start = (parseInt(count) + parseInt(this.requestParams.start()));
                    } else {
                        this.searchParams.start = (parseInt(this.requestParams.count()) + parseInt(this.requestParams.start()));
                    }
                },
                resetStartAndTotal: () => {
                    this.helper.hasMore = true;
                    this.searchParams.total = 0;
                    this.searchParams.start = 0;
                },
                moreRecordsExist: () => ((parseInt(this.searchParams.total) - parseInt(this.requestParams.start())) > 0),
                clearSearchParams: (specificParam) => {
                    if (specificParam === 'location') {
                        this.searchParams.location.length = 0;
                    } else if (specificParam === 'category') {
                        this.searchParams.category.length = 0;
                    } else if (specificParam === 'text') {
                        this.searchParams.textSearch = '';
                    } else {
                        this.searchParams.textSearch = '';
                        this.searchParams.category.length = 0;
                        this.searchParams.location.length = 0;
                    }
                }
            });
    }

    get _publicServiceUrl() {
        let result = this._.publicServiceUrl;

        if (!result) {
            let corpToken = this.configuration.service.corpToken;
            let port = parseInt(this.configuration.service.port) || 443;
            let scheme = `http${port === 443 ? 's' : ''}`;
            let swimlane = this.configuration.service.swimlane;

            result = this._.publicServiceUrl = `${scheme}://public-rest${swimlane}.bullhornstaffing.com:${port}/rest-services/${corpToken}`;
        }

        return result;
    }

    get _queryUrl() {
        return this._.queryUrl || (this._.queryUrl = `${this._publicServiceUrl}/query/JobBoardPost`);
    }

    get requestParams() {
        return this._.requestParams || (this._.requestParams = {
                sort: () => this.searchParams.sort || this.configuration.additionalJobCriteria.sort,
                count: () => this.searchParams.count || SearchService._count,
                start: () => this.searchParams.start || 0,
                publishedCategory: (isSearch, fields) => {
                    if ('publishedCategory(id,name)' !== fields) {
                        if (this.searchParams.category.length > 0) {
                            let equals = isSearch ? ':' : '=';

                            let fragment = ' AND (';
                            let first = true;

                            for (let i = 0; i < this.searchParams.category.length; i++) {
                                if (!first) {
                                    fragment += ' OR ';
                                } else {
                                    first = false;
                                }

                                fragment += 'publishedCategory.id' + equals + this.searchParams.category[i];
                            }

                            return fragment + ')';
                        }
                    }

                    return '';
                },
                location: (isSearch, fields) => {
                    if ('address(city,state)' !== fields) {
                        if (this.searchParams.location.length > 0) {
                            let delimiter = isSearch ? '"' : '\'';
                            let equals = isSearch ? ':' : '=';

                            let fragment = ' AND (';
                            let first = true;

                            for (let j = 0; j < this.searchParams.location.length; j++) {
                                if (!first) {
                                    fragment += ' OR ';
                                } else {
                                    first = false;
                                }

                                let location = this.searchParams.location[j];

                                let city = isSearch ? location.split('|')[0] : location.split('|')[0].replace(/'/g, '\'\'');
                                let state = location.split('|')[1];

                                fragment += '(address.city' + equals + delimiter + city + delimiter + ' AND address.state' + equals + delimiter + state + delimiter + ')';
                            }

                            return fragment + ')';
                        }
                    }

                    return '';
                },
                text: () => {
                    if (this.searchParams.textSearch) {
                        return ' AND (title:' + this.searchParams.textSearch + '* OR publicDescription:' + this.searchParams.textSearch + '*)';
                    }

                    return '';
                },
                query: (isSearch, additionalQuery, fields) => {
                    let query = `(isOpen${isSearch ? ':1' : '=true'} AND isDeleted${isSearch ? ':0' : '=false'})${this.jobCriteria(isSearch)}`;

                    if (additionalQuery) {
                        query += ` AND (${additionalQuery})`;
                    }

                    if (isSearch) {
                        query += encodeURIComponent(this.requestParams.text());
                    }

                    query += this.requestParams.publishedCategory(isSearch, fields);
                    query += this.requestParams.location(isSearch, fields);

                    return query;
                },
                whereIDs: (jobs, isSearch) => {
                    let getValue = isSearch ? (job) => 'id:' + job.id : (job) => job.id;
                    let join = isSearch ? ' OR ' : ',';
                    let prefix = isSearch ? '' : 'id IN ';

                    let values = [];

                    for (let i = 0; i < jobs.length; i++) {
                        values.push(getValue(jobs[i]));
                    }

                    return prefix + '(' + values.join(join) + ')';
                },
                relatedJobs: (publishedCategoryID, idToExclude) => {
                    let query = `(isOpen=true) AND publishedCategory.id=${publishedCategoryID}`;

                    if (idToExclude && parseInt(idToExclude) > 0) {
                        query += ' AND id <>' + idToExclude;
                    }

                    return query;
                },
                find: (jobID) => {
                    return 'id=' + jobID;
                },
                assembleForSearchWhereIDs: (jobs) => {
                    let where = this.requestParams.query(true, this.requestParams.whereIDs(jobs, true));

                    return '?start=0&query=' + where + '&fields=id&count=' + SearchService._count;
                },
                assembleForQueryForIDs: (start, count) => {
                    return '?where=' + this.requestParams.query(false) + '&fields=' + SearchService._fields + '&count=' + count + '&orderBy=' + this.configuration.additionalJobCriteria.sort + '&start=' + start;
                },
                assembleForSearchForJobs: (start, count) => {
                    return '?query=' + this.requestParams.query(true) + '&fields=' + SearchService._fields + '&count=' + count + '&sort=' + this.configuration.additionalJobCriteria.sort + '&start=' + start;
                },
                assembleForGroupByWhereIDs: (fields, orderByFields, start, count, jobs) => {
                    return '?where=' + this.requestParams.whereIDs(jobs, false) + '&groupBy=' + fields + '&fields=' + fields + ',count(id)&count=' + count + '&orderBy=+' + orderByFields + ',-count.id&start=' + start;
                },
                assembleForSearchForIDs: (start, count, fields) => {
                    return '?showTotalMatched=true&query=' + this.requestParams.query(true, undefined, fields) + '&fields=id&sort=id&count=' + count + '&start=' + start;
                },
                assembleForRelatedJobs: (publishedCategoryID, idToExclude) => {
                    return '?start=0&where=' + this.requestParams.relatedJobs(publishedCategoryID, idToExclude) + '&fields=' + SearchService._fields + '&sort=' + this.requestParams.sort() + '&count=' + this.configuration.maxRelatedJobs;
                },
                assembleForFind: (jobID) => {
                    return '?start=0&count=1&where=' + this.requestParams.find(jobID) + '&fields=' + SearchService._fields;
                }
            });
    }

    get searchParams() {
        return this._.searchParams || (this._.searchParams = {
                textSearch: '',
                location: [],
                category: [],
                sort: '',
                count: '',
                start: '',
                total: '',
                reloadAllData: true
            });
    }

    get _searchUrl() {
        return this._.searchUrl || (this._.searchUrl = `${this._publicServiceUrl}/search/JobOrder`);
    }

    getCountByLocation(callback, errorCallback) {
        return this.getCountBy('address(city,state)', 'address.city,address.state', callback, errorCallback);
    }

    getCountByCategory(callback, errorCallback) {
        return this.getCountBy('publishedCategory(id,name)', 'publishedCategory.name', callback, errorCallback);
    }

    getCountWhereIDs() {
        this.$http({
            method: 'GET',
            url: this._queryUrl + this.requestParams.assembleForGroupByWhereIDs(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4])
        }).success(data => {
            arguments[5](data);
        }).error(() => {
        });
    }

    recursiveSearchForIDs(callback, start, count, fields) {
        this.$http({
            method: 'GET',
            url: this._searchUrl + this.requestParams.assembleForSearchForIDs(start, count, fields)
        }).success(data => {
            callback(data);
        }).error(() => {
        });
    }

    getCountBy(fields, orderByFields, callback, errorCallback) {
        errorCallback = errorCallback || function () {
            };

        let totalRecords = [];
        let start = 0;

        let controller = this;

        let callbackIfNoMore = (data) => {
            if (data.data.length) {
                controller.getCountWhereIDs(fields, orderByFields, start, controller.configuration.service.batchSize, data.data, (counts) => {
                    totalRecords = totalRecords.concat(counts.data);

                    if (data.total > data.count) {
                        start += controller.configuration.service.batchSize;

                        controller.recursiveSearchForIDs(callbackIfNoMore, start, controller.configuration.service.batchSize);
                    } else {
                        callback(totalRecords);
                    }
                });
            } else {
                callback(totalRecords);
            }
        };

        this.recursiveSearchForIDs(callbackIfNoMore, start, this.configuration.service.batchSize, fields);
    }

    searchWhereIDs(jobs, callback) {
        this.$http({
            method: 'GET',
            url: this._searchUrl + this.requestParams.assembleForSearchWhereIDs(jobs)
        }).success(data => {
            callback(data.data);
        }).error(() => {
        });
    }

    recursiveSearchForJobs(callbackIfNoMore, start, count, errorCallback) {
        errorCallback = errorCallback || (() => {
            });

        this
            .$http({
                method: 'GET',
                url: this._searchUrl + this.requestParams.assembleForSearchForJobs(start, count)
            })
            .success(callbackIfNoMore)
            .error(errorCallback);
    }

    findJobs() {
        if (this.searchParams.reloadAllData) {
            this.helper.emptyCurrentDataList();
            this.helper.resetStartAndTotal();
        }

        let controller = this;

        let allJobs = [];
        let start = this.requestParams.start();
        let count = this.requestParams.count();

        this.helper.hasMore = false;
        this.helper.isSearching = true;

        let doneFinding = (jobs) => {
            controller.helper.isSearching = false;
            controller.helper.updateStart();

            if (controller.searchParams.reloadAllData) {
                controller.currentListData = jobs;
            } else {
                controller.currentListData.push.apply(controller.currentListData, jobs);
            }
        };

        let callbackIfNoMore = (data) => {
            if (data.data.length) {
                for (let i = 0; i < data.data.length; i++) {
                    allJobs.push(data.data[i]);
                }

                if (data.count < count) {
                    doneFinding(allJobs);
                } else if (allJobs.length >= controller.requestParams.count()) {
                    this.helper.hasMore = true;
                    doneFinding(allJobs);
                } else {
                    controller.helper.updateStart(count);
                    start = controller.requestParams.start();
                    controller.recursiveSearchForJobs(callbackIfNoMore, start, count);
                }
            } else {
                doneFinding(allJobs);
            }
        };

        this.recursiveSearchForJobs(callbackIfNoMore, start, count);
    }

    loadJobData(jobID, callback, errorCallback) {
        errorCallback = errorCallback || function () {
            };

        this.$http({
            method: 'GET',
            url: this._queryUrl + this.requestParams.assembleForFind(jobID)
        }).success(data => {
            if (data && data.data && data.data.length) {
                callback(data.data[0]);
            }
            else {
                errorCallback();
            }
        }).error(() => errorCallback());
    }

    loadJobDataByCategory(categoryID, idToExclude) {
        let deferred = this.$q.defer();

        this.$http({
            method: 'GET',
            url: this._queryUrl + this.requestParams.assembleForRelatedJobs(categoryID, idToExclude)
        }).success(data => {
            if (data && data.data && data.data.length) {
                deferred.resolve(data.data);
            }
            else {
                deferred.reject({message: 'no data was returned from the server'});
            }
        }).error(error => {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    jobCriteria(isSearch) {
        let field = this.configuration.additionalJobCriteria.field;
        let values = this.configuration.additionalJobCriteria.values;
        let query = '';
        let delimiter = isSearch ? '"' : '\'';
        let equals = isSearch ? ':' : '=';


        if (field && values.length > 0 && field !== '[ FILTER FIELD HERE ]' && values[0] !== '[ FILTER VALUE HERE ]') {
            for (let i = 0; i < values.length; i++) {
                if (i > 0) {
                    query += ` OR `;
                } else {
                    query += ' AND (';
                }
                query += `${field}${equals}${delimiter}${values[i]}${delimiter}`;
            }
            query += ')';
        }
        return query;
    }
}

export default SearchService;
