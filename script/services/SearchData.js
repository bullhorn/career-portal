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
                queryUrl: 'http://public.bh-bos2.bullhorn.qa:8181/rest-services/1hs/query/JobBoardPost',
                additionalSearchQuery: 'isOpen:1',
                additionalQuery: 'isOpen=true',
                sort: "-dateLastPublished",
                fields: "id,title,publishedCategory(id,name),address(city,state),employmentType,dateLastPublished,publicDescription",
                count: 20,
                start: 0,
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
                publishedCategory: (isSearch, fields) => {
                    if('publishedCategory(id,name)' != fields) {
                        if (this.searchParams.category.length > 0) {
                            var equals = isSearch ? ':' : '=';

                            var fragment = ' AND (';
                            var first = true;

                            for (var i = 0; i < this.searchParams.category.length; i++) {
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
                    if('address(city,state)' != fields) {
                        if (this.searchParams.location.length > 0) {
                            var delimiter = isSearch ? '"' : '\'';
                            var equals = isSearch ? ':' : '=';

                            var fragment = ' AND (';
                            var first = true;

                            for (var j = 0; j < this.searchParams.location.length; j++) {
                                if (!first) {
                                    fragment += ' OR ';
                                } else {
                                    first = false;
                                }

                                var location = this.searchParams.location[j].split(',');

                                fragment += '(address.city' + equals + delimiter + location[0] + delimiter + ' AND address.state' + equals + delimiter + location[1] + delimiter + ')';
                            }

                            return fragment + ')';
                        }
                    }

                    return '';
                },
                text : () => {
                    if (this.searchParams.textSearch) {
                        return ' AND (title:' + this.searchParams.textSearch + '* OR publishedDescription:' + this.searchParams.textSearch + '*)';
                    }

                    return '';
                },

                query: (isSearch, additionalQuery, fields) => {
                    var query = '(' + (isSearch ? this.config.additionalSearchQuery : this.config.additionalQuery) + ')';

                    if(additionalQuery) {
                        query += ' AND (' + additionalQuery + ')';
                    }

                    if(isSearch) {
                        query += this.requestParams.text();
                    }

                    query += this.requestParams.publishedCategory(isSearch, fields);
                    query += this.requestParams.location(isSearch, fields);

                    return query;
                },
                whereIDs: (jobs, isSearch) => {
                    var getValue = isSearch ? (job) => 'id:'+job.id : (job) => job.id;
                    var join = isSearch ? ' OR ' : ',';
                    var prefix = isSearch ? '' : 'id IN ';

                    var values = [];

                    for(var i = 0; i < jobs.length; i++) {
                        values.push(getValue(jobs[i]));
                    }

                    return prefix + '(' + values.join(join) + ')';
                },
                relatedJobs: (publishedCategoryID, idToExclude) => {
                    var query = '(' + this.config.additionalQuery + ') AND publishedCategory.id=' + publishedCategoryID;

                    if (idToExclude && parseInt(idToExclude) > 0)
                        query += ' AND id <>' + idToExclude;

                    return query;
                },
                find: (jobID) => {
                    return '(' + this.config.additionalQuery + ') AND id=' + jobID;
                },

                assembleForSearchWhereIDs: (jobs) => {
                    var where = this.requestParams.query(true, this.requestParams.whereIDs(jobs, true));

                    return '?useV2=true&start=0&query=' + where + '&fields=id&count=' + this.config.count ;
                },
                assembleForQueryForIDs: (start, count) => {
                    return '?useV2=true&where=' + this.requestParams.query(false) + '&fields=' + this.config.fields + '&count=' + count + '&orderBy=' + this.config.sort + '&start=' + start;
                },
                assembleForGroupByWhereIDs: (fields, orderByFields, start, count, jobs) => {
                    return '?where=' + this.requestParams.whereIDs(jobs, false) + '&groupBy=' + fields + '&fields=' + fields + ',count(id)'
                        + '&count=' + count + '&orderBy=-count.id,+' + orderByFields + '&start=' + start + '&useV2=true';
                },
                assembleForSearchForIDs: (start, count, fields) => {
                    return '?useV2=true&showTotalMatched=true&query=' + this.requestParams.query(true, undefined, fields) + '&fields=id&sort=id&count=' + count + '&start=' + start;
                },
                assembleForFindJobs: () => {
                    return '?useV2=true&query=' + this.requestParams.query(true) + '&fields=' + this.config.fields + '&sort=' + this.requestParams.sort() + '&count=' + this.requestParams.count() + '&start=' + this.requestParams.start();
                },
                assembleForRelatedJobs: (publishedCategoryID, idToExclude) => {
                    return '?useV2=true&start=0&where=' + this.requestParams.relatedJobs(publishedCategoryID, idToExclude) + '&fields=' + this.config.fields + '&sort=' + this.requestParams.sort() + '&count=' + this.requestParams.count();
                },
                assembleForFind: (jobID) => {
                    return '?useV2=true&start=0&count=1&where=' + this.requestParams.find(jobID) + '&fields=' + this.config.fields;
                }
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
            return this.getCountBy('address(city,state)', 'address.city,address.state', callback, errorCallback);
        }

        getCountByCategory(callback, errorCallback) {
            return this.getCountBy('publishedCategory(id,name)', 'publishedCategory.name', callback, errorCallback);
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

        getCountBy(fields, orderByFields, callback, errorCallback) {
            errorCallback = errorCallback || function() { };

            var totalRecords = [];
            var start = 0;

            var controller = this;

            var callbackIfNoMore = (data) => {
                if(data.data.length) {
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
        }

        searchWhereIDs(jobs, callback) {
            this
                .$http({
                    method: 'GET',
                    url: this.config.searchUrl + this.requestParams.assembleForSearchWhereIDs(jobs)
                })
                .success(data => {
                    callback(data.data);
                })
                .error(() => { });
        }

        recursiveQueryForIDs(callbackIfNoMore, start, count, errorCallback) {
            errorCallback = errorCallback || (() => { });

            this
                .$http({
                    method: 'GET',
                    url: this.config.queryUrl + this.requestParams.assembleForQueryForIDs(start, count)
                })
                .success(callbackIfNoMore)
                .error(errorCallback);
        }

        findJobs() {
            if (this.searchParams.reloadAllData) {
                this.helper.emptyCurrentDataList();
                this.helper.resetStartAndTotal();
            }

            var controller = this;

            var allJobs = [];
            var start = 0;
            var count = this.config.count;

            var doneFinding = (jobs) => {
                controller.helper.updateStartAndTotal(jobs);

                if (controller.searchParams.reloadAllData) {
                    controller.currentListData = jobs;
                } else {
                    controller.currentListData.push.apply(controller.currentListData, jobs);
                }
            };

            var callbackIfNoMore = (data) => {
                if(data.data.length) {
                    controller.searchWhereIDs(data.data, (jobs) => {
                        for(var i = 0; i < data.data.length; i++) {
                            for(var i2 = 0; i2 < jobs.length; i2++) {
                                if(jobs[i2].id == data.data[i].id) {
                                    allJobs.push(data.data[i]);
                                }
                            }
                        }

                        if (allJobs.length >= controller.config.count || jobs.length < controller.config.count) {
                            doneFinding(allJobs);
                        } else {
                            start += controller.config.batchSize;
                            count = parseInt((controller.config.count / jobs.length) * count);
                            controller.recursiveQueryForIDs(callbackIfNoMore, start, count);
                        }
                    });
                } else {
                    doneFinding(allJobs);
                }
            };

            this.recursiveQueryForIDs(callbackIfNoMore, start, count);
        }

        loadJobData(jobID, callback, errorCallback) {
            errorCallback = errorCallback || function() { };

            this
                .$http({
                    method: 'GET',
                    url: this.config.queryUrl + this.requestParams.assembleForFind(jobID)
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
                    url: this.config.queryUrl + this.requestParams.assembleForRelatedJobs(categoryID, idToExclude)
                })
                .success(data => {
                    if (data && data.data && data.data.length) callback(data.data);
                    else errorCallback();
                })
                .error(() => errorCallback());
        }

        //#endregion

    }
];
