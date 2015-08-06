class JobListController {
    constructor(SharedData, SearchService, moment) {
        'ngInject';

        this.SearchService = SearchService;
        this.moment = moment;
        this.SharedData = SharedData;

        // Set the view state
        this.SharedData.viewState = 'overview-closed';
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

    clearSearchParamsAndLoadData() {
        this.SearchService.helper.clearSearchParams();
        this.SearchService.searchParams.reloadAllData = true;
        this.SearchService.findJobs();
    }
}

export default JobListController;