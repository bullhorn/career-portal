/* moment:false */
import routerConfig from './index.route';
import localeConfig from './index.locale';

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

import AppConfig from '../app.json';

angular.module('CareerPortal', ['ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ngFileUpload', '720kb.tooltips', 'ng-fastclick', 'ngLocalize', 'ngLocalize.Config', 'ngLocalize.InstalledLanguages', 'ngLocalize.Events'])
    .constant('moment', moment)
    .constant('configuration', AppConfig)
    .constant('localeConf', {})
    .constant('localeSupported', [])
    .config(routerConfig)
    .config(localeConfig)
    .directive('main', () => new Main())
    .directive('careerPortalSidebar', () => new CareerPortalSidebar())
    .directive('careerPortalHeader', () => new CareerPortalHeader())
    .directive('careerPortalModal', () => new CareerPortalModal())
    .controller('JobListController', JobListController)
    .controller('JobDetailController', JobDetailController)
    .filter('stripHtml', () => new StripHtmlFilter())
    .filter('omitFilters', () => new OmitFiltersFilter())
    .factory('SharedData', () => new SharedData())
    .service('ShareService', ShareService)
    .service('ApplyService', ApplyService)
    .service('SearchService', SearchService);