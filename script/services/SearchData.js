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
                        toggle: function() {
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
                assembleForGroupByQuery: (fields, orderByFields, additionalQuery) => {
                    var where = '(' + this.config.additionalQuery + ')';
                    var first;

                    if(additionalQuery) {
                        where += ' AND ('+additionalQuery+')';
                    }

                    if (this.searchParams.textSearch)
                        where += ' AND (title LIKE ' + this.searchParams.textSearch + '% OR publishedDescription LIKE ' + this.searchParams.textSearch + '%)';

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

                    if ('address(state)' != fields && this.searchParams.location.length > 0) {
                        where += ' AND (';

                        first = true;
                        for (var j = 0; j < this.searchParams.location.length; j++) {
                            if (!first) {
                                where += ' OR ';
                            } else {
                                first = false;
                            }

                            where += 'address.state=\'' + this.searchParams.location[j] + '\'';
                        }

                        where += ')';
                    }

                    return '?where=' + where + '&groupBy=' + fields + '&fields=' + fields + ',count(id)'
                        + '&count=500&orderBy=-count.id,+' + orderByFields + '&start=0&useV2=true';
                },
                assembleForSearch: () => {
                    var query = '(' + this.config.additionalSearchQuery + ')';
                    var first;

                    if (this.searchParams.textSearch)
                        query += ' AND (title:' + this.searchParams.textSearch + '* OR publishedDescription:' + this.searchParams.textSearch + '*)';

                    if (this.searchParams.category.length > 0) {
                        query += ' AND (';

                        first = true;
                        for (var i = 0; i < this.searchParams.category.length; i++) {
                            if (!first) {
                                query += ' OR ';
                            } else {
                                first = false;
                            }

                            query += 'publishedCategory.id:'+this.searchParams.category[i];
                        }

                        query += ')';
                    }

                    if (this.searchParams.location.length > 0) {
                        query += ' AND (';

                        first = true;
                        for (var j = 0; j < this.searchParams.location.length; j++) {
                            if (!first) {
                                query += ' OR ';
                            } else {
                                first = false;
                            }

                            query += 'address.state:"' + this.searchParams.location[j] + '"';
                        }

                        query += ')';
                    }

                    return '?query=' + query + '&fields=' + this.config.fields + '&sort=' + this.requestParams.sort() + '&count=' + this.requestParams.count() + '&start=' + this.requestParams.start() + '&useV2=true';
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
            return this.getCountBy('address(state)', 'address.state', 'address.state IS NOT NULL', callback, errorCallback);
        }

        getCountByCategory(callback, errorCallback) {
            return this.getCountBy('publishedCategory(id,name)', 'publishedCategory.name', 'publishedCategory IS NOT NULL',callback, errorCallback);
        }

        getCountBy(fields, orderByFields, additionalQuery, callback, errorCallback) {
            errorCallback = errorCallback || function() { };

            this
                .$http({
                    method: 'GET',
                    url: this.config.queryUrl + this.requestParams.assembleForGroupByQuery(fields, orderByFields, additionalQuery)
                })
                .success(data => {
                    if (data && data.data) callback(data.data);
                    else errorCallback();
                })
                .error(() => errorCallback());
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
