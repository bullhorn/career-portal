import 'angular';

export default [
    '$http',
    class {

        constructor($http) {
            this.$http = $http;
        }

        //#region Properties

        /**
         * A dictionary that contains the collective state of an SearchData instance.
         * 
         * @private
         * @returns { Object }
         */
        get _() {
            return this.__ || (this.__ = Object.create(null, {}));
        }

        get config() {
            return {
                searchUrl: 'http://public.bh-bos2.bullhorn.qa:8181/rest-services/1hs/search/JobOrder',
                queryUrl: 'http://public.bh-bos2.bullhorn.qa:8181/rest-services/1hs/query/JobOrder',
                additionalSearchQuery: 'isOpen:1',
                additionalQuery: 'isOpen=true',
                sort: "-dateAdded",
                fields: "id,title,publishedCategory,address,employmentType,dateAdded,publicDescription",
                count: "20",
                start: "0",
                batchSize: 500,
                loadJobsOnStart: true,
                portalText: {
                    companyName: 'Acme Staffing',
                    joblist: {
                        header: "Open Jobs",
                        loadMoreData: "Load more..."
                    },
                    overview: {
                        header: "Job Description",
                        applyButtonLabel: 'Apply now'
                    },
                    sidebar: {
                        searchPlaceholder: 'Keyword Search',
                        locationHeader: 'Location',
                        categoryHeader: 'Category'
                    },
                    modal: {
                        uploadResumeFile: 'Upload Resume File',
                        toggle: () => {
                            if(!this.header || this.header == this.thankYou.header) {
                                this.header = this.apply.header;
                                this.subHeader = this.apply.subHeader;
                            } else {
                                this.header = this.thankYou.header;
                                this.subHeader = this.thankYou.subHeader;
                            }
                        },
                        apply: {
                            header: 'Before You Apply...',
                            subHeader: 'Please let us know who you are and upload your resume'
                        },
                        thankYou: {
                            header: 'Thank you!',
                            subHeader: 'Thank you for submitting your online application'
                        }
                    }
                }
            };
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
                emptyCurrentDataList: () => this.currentListData.length = 0,
                updateStartAndTotal: data => {
                    this.searchParams.total = data.total;
                    this.searchParams.start = (parseInt(this.requestParams.count()) + parseInt(this.requestParams.start()));
                },
                resetStartAndTotal: () => {
                    this.searchParams.total = 0;
                    this.searchParams.start = 0;
                },
                moreRecordsExist: () => ((parseInt(this.searchParams.total) - parseInt(this.requestParams.start())) > 0),
                clearSearchParams: () => {
                    this.searchParams.textSearch = '';
                    this.searchParams.category.length = 0;
                    this.searchParams.location.length = 0;
                }
            });
        }

        get requestParams() {
            return this._.requestParams || (this._.requestParams = {
                sort: () => this.searchParams.sort || this.config.sort,
                count: () => this.searchParams.count || this.config.count,
                start: () => this.searchParams.start || this.config.start,
                query:(fields) => {
                    var query = '(' + this.config.additionalSearchQuery + ')';
                    var first;

                    if (this.searchParams.textSearch)
                        query += ' AND (title:' + this.searchParams.textSearch + '* OR publishedDescription:' + this.searchParams.textSearch + '*)';

                    if('publishedCategory(id,name)' != fields) {
                        if (this.searchParams.category.length > 0) {
                            query += ' AND (';

                            first = true;
                            for (var i = 0; i < this.searchParams.category.length; i++) {
                                if (!first) {
                                    query += ' OR ';
                                } else {
                                    first = false;
                                }

                                query += 'publishedCategory.id:' + this.searchParams.category[i];
                            }

                            query += ')';
                        }
                    }

                    if('address(city,state)' != fields) {
                        if (this.searchParams.location.length > 0) {
                            query += ' AND (';

                            first = true;
                            for (var j = 0; j < this.searchParams.location.length; j++) {
                                if (!first) {
                                    query += ' OR ';
                                } else {
                                    first = false;
                                }

                                var location = this.searchParams.location[j].split(',');

                                query += '(address.city:"' + location[0] + '" AND address.state:"' + location[1] + '")';
                            }

                            query += ')';
                        }
                    }

                    return query;
                },
                assembleForGroupByQuery: (fields, orderByFields, additionalQuery, start, count) => {
                    var where = '(' + this.config.additionalQuery + ')';
                    var first;

                    if(additionalQuery) {
                        where += ' AND ('+additionalQuery+')';
                    }

                    if ('publishedCategory(id,name)' != fields && this.searchParams.category.length > 0) {
                        where += ' AND (';

                        first = true;
                        for (var i = 0; i < this.searchParams.category.length; i++) {
                            if (!first) {
                                where += ' OR ';
                            } else {
                                first = false;
                            }

                            where += 'publishedCategory.id='+this.searchParams.category[i];
                        }

                        where += ')';
                    }

                    if ('address(city,state)' != fields && this.searchParams.location.length > 0) {
                        where += ' AND (';

                        first = true;
                        for (var j = 0; j < this.searchParams.location.length; j++) {
                            if (!first) {
                                where += ' OR ';
                            } else {
                                first = false;
                            }

                            var location = this.searchParams.location[j].split(',');

                            where += '(address.city=\''+location[0]+'\' AND address.state=\'' + location[1] + '\')';
                        }

                        where += ')';
                    }

                    return '?where=' + where + '&groupBy=' + fields + '&fields=' + fields + ',count(id)'
                        + '&count=' + count + '&orderBy=-count.id,+' + orderByFields + '&start=' + start + '&useV2=true';
                },
                assembleForGroupByWhereIDs: (fields, orderByFields, start, count, jobs) => {
                    var ids = [];

                    for(var i = 0; i < jobs.length; i++) {
                        ids.push(jobs[i].id);
                    }

                    var where = 'id IN (' + ids.join(',') + ')';

                    return '?where=' + where + '&groupBy=' + fields + '&fields=' + fields + ',count(id)'
                        + '&count=' + start + '&orderBy=-count.id,+' + orderByFields + '&start=' + start + '&useV2=true';
                },
                assembleForSearchForIDs: (start, count, fields) => {
                    return '?query=' + this.requestParams.query(fields) + '&fields=id&sort=id&count=' + count + '&start=' + start + '&useV2=true&showTotalMatched=true';
                },
                assembleForSearch: () => {
                    return '?query=' + this.requestParams.query() + '&fields=' + this.config.fields + '&sort=' + this.requestParams.sort() + '&count=' + this.requestParams.count() + '&start=' + this.requestParams.start() + '&useV2=true';
                },
                assembleForCategories: (categoryID, idToExclude) => {
                    var query = '(' + this.config.additionalSearchQuery + ') AND publishedCategory.id:' + categoryID;

                    if (idToExclude && parseInt(idToExclude) > 0)
                        query += ' NOT id:' + idToExclude;

                    return '?' + 'query=' + query + '&fields=' + this.config.fields + '&count=' + this.requestParams.count() + '&start=0&sort=' + this.requestParams.sort() + '&useV2=true';
                },
                assembleForFind: jobID => '?' + 'query=(' + this.config.additionalSearchQuery + ') AND id:' + jobID + '&fields=' + this.config.fields + '&count=1&start=0&sort=' + this.requestParams.sort() + '&useV2=true'
            });
        }

        get searchParams() {
            return this._.searchParams || (this._.searchParams = {
                textSearch: "",
                location: [],
                category: [],
                sort: "",
                count: "",
                start: "",
                total: "",
                reloadAllData: true
            });
        }

        //#endregion

        //#region Methods

        getCountByLocation(callback, errorCallback) {
            return this.getCountBy('address(city,state)', 'address.city,address.state', 'address.city IS NOT NULL AND address.state IS NOT NULL', callback, errorCallback);
        }

        getCountByCategory(callback, errorCallback) {
            return this.getCountBy('publishedCategory(id,name)', 'publishedCategory.name', 'publishedCategory IS NOT NULL',callback, errorCallback);
        }

        loadJobData(jobID, callback, errorCallback) {
            errorCallback = errorCallback || function() { };

            this
                .$http({
                    method: 'GET',
                    url: this.config.searchUrl + this.requestParams.assembleForFind(jobID)
                })
                .success(data => {
                    if (data && data.data && data.data.length) callback(data.data[0]);
                    else errorCallback();
                })
                .error(() => errorCallback());
        }

        loadJobDataByCategory(categoryID, callback, errorCallback, idToExclude) {
            errorCallback = errorCallback || function() { };

            this
                .$http({
                    method: 'GET',
                    url: this.config.searchUrl + this.requestParams.assembleForCategories(categoryID, idToExclude)
                })
                .success(data => {
                    if (data && data.data && data.data.length) callback(data.data);
                    else errorCallback();
                })
                .error(() => errorCallback());
        }

        recursiveGetCountBy() {
            this
                .$http({
                    method: 'GET',
                    url: this.config.queryUrl + this.requestParams.assembleForGroupByQuery(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4])
                })
                .success(data => {
                    arguments[5](data);
                })
                .error(() => arguments[6]());
        }

        getCountWhereIDs() {
            this
                .$http({
                    method: 'GET',
                    url: this.config.queryUrl + this.requestParams.assembleForGroupByWhereIDs(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4])
                })
                .success(data => {
                    arguments[5](data);
                })
                .error(() => { });
        }

        recursiveSearchForIDs(callback, start, count, fields) {
            this
                .$http({
                    method: 'GET',
                    url: this.config.searchUrl + this.requestParams.assembleForSearchForIDs(start, count, fields)
                })
                .success(data => {
                    callback(data);
                })
                .error(() => { });
        }

        getCountBy(fields, orderByFields, additionalQuery, callback, errorCallback) {
            errorCallback = errorCallback || function() { };

            var totalRecords = [];
            var start = 0;

            var controller = this;
            var callbackIfNoMore;

            if(this.searchParams.textSearch) {
                callbackIfNoMore = (data) => {
                    //fields, orderByFields, ids, start, count
                    if(data.data) {
                        controller.getCountWhereIDs(fields, orderByFields, start, controller.config.batchSize, data.data, (counts) => {
                            totalRecords = totalRecords.concat(counts.data);

                            if (data.total > data.count) {
                                start += controller.config.batchSize;

                                controller.recursiveSearchForIDs(callbackIfNoMore, start, controller.config.batchSize);
                            } else {
                                callback(totalRecords);
                            }
                        });
                    } else {
                        callback(totalRecords);
                    }
                };

                this.recursiveSearchForIDs(callbackIfNoMore, start, this.config.batchSize, fields);
            } else {
                callbackIfNoMore = (data) => {
                    totalRecords = totalRecords.concat(data.data);

                    if (data.data.length >= controller.config.batchSize) {
                        start += controller.config.batchSize;

                        controller.recursiveGetCountBy(fields, orderByFields, additionalQuery, start, controller.config.batchSize, callbackIfNoMore, errorCallback);
                    } else {
                        callback(totalRecords);
                    }
                };

                this.recursiveGetCountBy(fields, orderByFields, additionalQuery, start, this.config.batchSize, callbackIfNoMore, errorCallback);
            }
        }

        makeSearchApiCall() {
            if (this.searchParams.reloadAllData) {
                this.helper.emptyCurrentDataList();
                this.helper.resetStartAndTotal();
            }

            this
                .$http({
                    method: 'GET',
                    url: this.config.searchUrl + this.requestParams.assembleForSearch()
                })
                .success(data => {
                    this.helper.updateStartAndTotal(data);

                    if (this.searchParams.reloadAllData) this.currentListData = data.data;
                    else this.currentListData.push.apply(this.currentListData, data.data);
                })
                .error(() => { });
        }

        //#endregion

    }
];
