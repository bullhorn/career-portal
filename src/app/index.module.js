/* moment:false */
import routerConfig from './index.route';
import localeConfig from './index.locale';
import translationConfig from './index.translations';

import JobListController from './list/list.controller';
import JobDetailController from './detail/detail.controller';

import Main from './main/main.directive';
import CareerPortalSidebar from './sidebar/sidebar.directive';
import CareerPortalHeader from './header/header.directive';
import CareerPortalModal from './modal/modal.directive';

import SearchService from './services/search.service';
import ShareService from './services/share.service';
import ApplyService from './services/apply.service';
import SharedData from './services/shared.factory';

import StripHtmlFilter from './filters/striphtml.filter';
import OmitFiltersFilter from './filters/omitfilters.filter';
import TranslateDate from './filters/translateDate.directive';

angular.module('CareerPortal', ['ngAnimate', 'ngTouch', 'ngSanitize', 'ngCookies', 'ui.router', 'ngFileUpload', '720kb.tooltips', 'ng.deviceDetector', 'ng-fastclick', 'pascalprecht.translate'])
    .constant('moment', moment)
    .config(routerConfig)
    .config(translationConfig)
    .config(localeConfig)
    .directive('main', () => new Main())
    .directive('careerPortalSidebar', () => new CareerPortalSidebar())
    .directive('careerPortalHeader', () => new CareerPortalHeader())
    .directive('careerPortalModal', () => new CareerPortalModal())
    .directive('translateDate', TranslateDate)
    .controller('JobListController', JobListController)
    .controller('JobDetailController', JobDetailController)
    .filter('stripHtml', () => new StripHtmlFilter())
    .filter('omitFilters', () => new OmitFiltersFilter())
    .factory('SharedData', () => new SharedData())
    .service('ShareService', ShareService)
    .service('ApplyService', ApplyService)
    .service('SearchService', SearchService);

// Deferring the bootstrap to make sure we have loaded the config from app.json
deferredBootstrapper.bootstrap({
    element: document.body,
    module: 'CareerPortal',
    resolve: {
        configuration: function ($http) {
            'ngInject';
            return $http.get('./app.json');
        }
    }
});