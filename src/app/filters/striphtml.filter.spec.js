'use strict';

describe('Filter: StripHTML', function () {
    beforeEach(function () {
        module(function ($provide) {
            $provide.constant('configuration', {});
        });
    });

    beforeEach(module('CareerPortal'));
});
