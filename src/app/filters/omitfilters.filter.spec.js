'use strict';

describe('Filter: OmitFilters', function () {
    beforeEach(function () {
        module(function ($provide) {
            $provide.constant('configuration', {});
        });
    });

    beforeEach(module('CareerPortal'));
});
