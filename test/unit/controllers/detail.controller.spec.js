import JobDetailController from 'src/app/detail/detail.controller';
import BaseConfig from 'src/app.json';

beforeEach(function () {
    angular.module('test', [])
        .controller('JobDetailController', JobDetailController);
});

describe('Controller: JobDetailController', () => {
    var controller;

    describe('Initial State', () => {
        beforeEach(angular.mock.module('test', function ($provide) {

        }));

        beforeEach(inject(function (_JobDetailController_) {
            controller = _JobDetailController_;
        }));

        it('should exist', () => {
            expect(controller).toBeDefined();
        })
    });
});