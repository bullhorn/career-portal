/* moment:false */
import config from './index.config';
import routerConfig from './index.route';

import JobListController from './list/list.controller';
import JobDetailController from './detail/detail.controller';

import CareerPortalSidebar from './sidebar/sidebar.directive';
import CareerPortalHeader from './header/header.directive';
import CareerPortalModal from './modal/modal.directive';

import SearchService from './services/search.service';
import ShareService from './services/share.service';
import ApplyService from './services/apply.service';

import StripHtmlFilter from './filters/striphtml.filter';
import OmitFiltersFilter from './filters/omitfilters.filter';

angular.module('CareerPortal', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'checklist-model', 'file-model'])
    .constant('moment', moment)
    .config(config)
    .config(routerConfig)
    .directive('careerPortalSidebar', () => new CareerPortalSidebar())
    .directive('careerPortalHeader', () => new CareerPortalHeader())
    .directive('careerPortalModal', () => new CareerPortalModal())
    .controller('JobListController', JobListController)
    .controller('JobDetailController', JobDetailController)
    .filter('stripHtml', () => new StripHtmlFilter())
    .filter('omitFilters', () => new OmitFiltersFilter())
    .service('ShareService', ShareService)
    .service('ApplyService', ApplyService)
    .service('SearchService', SearchService);

// Defer the application until we have the configuration for the app!
deferredBootstrapper.bootstrap({
    element: document.body,
    module: 'CareerPortal',
    resolve: {
        configuration: ['$http', function ($http) {
            return $http.get('app.json');
        }]
    }
});
