'use strict';

describe('Service: ShareService', function () {
    beforeEach(function () {
        module(function ($provide) {
            $provide.constant('configuration', {});
        });
    });

    beforeEach(module('CareerPortal'));
});
