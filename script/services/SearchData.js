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
                additionalQuery: 'isOpen:1',
                sort: "-dateAdded",
                fields: "id,title,categories[10],address,employmentType,dateAdded,publicDescription",
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
                    this.searchParams.location.length = 0;
                    this.searchParams.category.length = 0;
                }
            });
        }

        get requestParams() {
            return this._.requestParams || (this._.requestParams = {
                sort: () => this.searchParams.sort || this.config.sort,
                count: () => this.searchParams.count || this.config.count,
                start: () => this.searchParams.start || this.config.start,
                assembleUsingAll: (groupBy, field) => {
                    var query = '(' + this.config.additionalQuery + ')';
                    var first;

                    if (this.searchParams.textSearch)
                        query += ' AND (title:' + this.searchParams.textSearch + '* OR publishedDescription:' + this.searchParams.textSearch + '*)';

                    if ('categories' != field && this.searchParams.category.length > 0) {
                        query += ' AND (';

                        first = true;
                        for (var i = 0; i < this.searchParams.category.length; i++) {
                            if (!first) {
                                query += ' OR ';
                            } else {
                                first = false;
                            }

                            query += 'categories.id:'+this.searchParams.category[i];
                        }

                        query += ')';
                    }

                    if ('address.state' != field && this.searchParams.location.length > 0) {
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

                    var count;
                    var sort;
                    var fields;
                    var start;

                    if (groupBy) {
                        count = '&groupByCount=' + field;
                        sort = '&sort=+' + field;
                        fields = '&fields='+field;
                        start = '';
                    } else {
                        count = '&count=' + this.requestParams.count();
                        sort = '&sort=' + this.requestParams.sort();
                        fields = '&fields='+this.config.fields;
                        start = '&start='+this.requestParams.start();
                    }

                    return '?' +
                        'query=' + query + fields + count + start + sort + '&useV2=true';
                },
                assemble: () => this.requestParams.assembleUsingAll(false),
                assembleForCategories: (categoryID, idToExclude) => {
                    var query = '(' + this.config.additionalQuery + ') AND categories.id:' + categoryID;

                    if (idToExclude && parseInt(idToExclude) > 0)
                        query += ' NOT id:' + idToExclude;

                    return '?' + 'query=' + query + '&fields=' + this.config.fields + '&count=' + this.requestParams.count() + '&start=0&sort=' + this.requestParams.sort() + '&useV2=true';
                },
                assembleForGroupBy: field => this.requestParams.assembleUsingAll(true, field),
                assembleForFind: jobID => '?' + 'query=(' + this.config.additionalQuery + ') AND id:' + jobID + '&fields=' + this.config.fields + '&count=1&start=0&sort=' + this.requestParams.sort() + '&useV2=true'
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

        getCountBy(field, callback, errorCallback) {
            errorCallback = errorCallback || function() { };

            this
                .$http({
                    method: 'GET',
                    url: this.config.searchUrl + this.requestParams.assembleForGroupBy(field)
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
                    url: this.config.searchUrl + this.requestParams.assemble()
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
