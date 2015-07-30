class JobListController {
    constructor($rootScope, configuration, SearchService, moment) {
        'ngInject';

        $rootScope.viewState = 'overview-closed';

        this.configuration = configuration;
        this.SearchService = SearchService;
        this.moment = moment;
    }

    getDisplayDate(date) {
        var momentDate = this.moment(date);
        var now = moment();

        if (now.diff(momentDate, 'days') > 1) {
            return momentDate.format('MM/DD/YY h:mm a');
        }
        return momentDate.fromNow();
    }

    loadMoreData() {
        this.SearchService.searchParams.reloadAllData = false;
        this.SearchService.findJobs();
    }
}

export default JobListController;
