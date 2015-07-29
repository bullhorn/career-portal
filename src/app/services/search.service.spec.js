'use strict';

describe('Service: SearchService', function () {
    beforeEach(function () {
        module(function ($provide) {
            $provide.constant('configuration', {});
        });
    });

    beforeEach(module('CareerPortal'));
});
