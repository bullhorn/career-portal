'use strict';

beforeEach(function () {
    module(function ($provide) {
        $provide.constant('configuration', {someUrl: '/dummyValue'});
        $provide.value('job', {})
    });
});

describe('Controller: JobDetailController', function () {
    var controller;

    beforeEach(module('CareerPortal'));

    beforeEach(inject(function ($controller) {
        controller = $controller('JobDetailController');
    }));

    describe('Initial State', function () {
        it('should exist', function () {
            expect(controller).toBeDefined();
        })
    });
});