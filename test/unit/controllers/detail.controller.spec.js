import JobDetailController from 'src/app/detail/detail.controller';
import BaseConfig from 'src/app.json';

beforeEach(angular.mock.module(function ($provide) {
    $provide.constant('configuration', BaseConfig);
}));

describe('Controller: JobDetailController', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    it('should exist', () => {
        return true;
    });
});