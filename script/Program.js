import 'angular';
import 'angular-animate';
import 'angular-route';
import 'angular-sanitize';
import 'checklist-model';
import 'jquery';

import FileModel from './directives/FileModel';
import CustomNgEnter from './directives/CustomNgEnter';
import ElHeight from './directives/ElHeight';
import Scroll from './directives/Scroll';
import StripHtml from './filters/StripHtml';
import ApplyJob from './services/ApplyJob';
import SearchData from './services/SearchData';
import ShareSocial from './services/ShareSocial';
import Sidebar from './controllers/Sidebar';
import JobDetail from './controllers/JobDetail';
import JobList from './controllers/JobList';
import Header from './controllers/Header';
import Modal from './controllers/Modal';

export default class {

    constructor() {
        throw new Error("Cannot invoke the constructor function of a static class.");
    }

    //#region Properties

    /**
     * A dictionary that contains the collective state of the Program.
     * 
     * @private
     * @static
     * @returns { Object }
     */
    static get _() {
        return this.__ || (this.__ = Object.create(null, {}));
    }

    /**
     * Gets a value indicating whether the Program is running.
     *
     * @static
     * @returns { Boolean }
     */
    static get running() {
        return this._.running || (this._.running = false);
    }
    /**
     * Sets a value indicating whether the Program is running. Attempts to set the value of this property
     * to any value other than true are ignored.
     * 
     * @static
     * @private
     * @param { Boolean } value
     */
    static set _running(value) {
        if (value) this._.running = value;
    }

    //#endregion

    //#region Methods

    /**
     * Bootstraps the CareerPortal angular module on the document in context.
     * 
     * @static
     */
    static run() {
        if (!this.running) {
            this._running = true;

            //??? is this button visible and used? if so, push handler into HeaderCtrl ilo ad-hoc jquery handler
            $('button[name="filters-menu"]').on('click', () => $('html body hgroup aside').toggle());

            angular
                .module('CareerPortal', ['ngRoute', 'ngAnimate', 'ngSanitize', 'checklist-model'])
                .config(['$routeProvider', $routeProvider => $routeProvider
                    .when('/jobs', {
                        templateUrl: 'view/joblist.html',
                        controller: 'JobList as jobs'
                    })
                    .when('/jobs/:id', {
                        templateUrl: 'view/overview.html',
                        controller: 'JobDetail as overview'
                    })
                    .otherwise({
                        redirectTo: '/jobs'
                    })
                ])
                .controller('SideBar', Sidebar)
                .controller('JobDetail', JobDetail)
                .controller('JobList', JobList)
                .controller('Header', Header)
                .controller('Modal', Modal)
                .directive('customNgEnter', CustomNgEnter)
                .directive('elHeight', ElHeight)
                .directive('fileModel', FileModel)
                .directive("scroll", Scroll)
                .service('searchData', SearchData)
                .service('applyJob', ApplyJob)
                .service('shareSocial', ShareSocial)
                .filter("stripHtml", StripHtml);

            angular.bootstrap(document, ['CareerPortal'], { strictDi: true });
            document.body.style.display = 'block';
        }
    }

//#endregion

}