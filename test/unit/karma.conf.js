'use strict';

var path = require('path');
var conf = require('../../build/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

function listFiles() {
    var wiredepOptions = _.extend({}, '../../lib', {
        dependencies: true,
        devDependencies: true
    });

    return wiredep(wiredepOptions).js
        .concat([
            '../../.tmp/serve/app/index.module.js',
            '../../src/**/*.html',
            '../../test/unit/**/*.spec.js',
            '../../test/unit/**/*.mock.js'
        ]);
}

module.exports = function (config) {
    var configuration = {
        files: listFiles(),

        singleRun: true,

        autoWatch: false,

        debug: true,

        frameworks: ['jasmine'],

        reporters: ['coverage', 'progress'],

        ngHtml2JsPreprocessor: {
            stripPrefix: 'src/',
            moduleName: 'CareerPortal'
        },

        browsers: ['PhantomJS'],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
            'karma-coverage'
        ],

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                {type: 'html', dir: 'reports', subdir: 'coverage'},
                {type: 'lcov', dir: 'reports', subdir: 'lcov'}
            ]
        },

        preprocessors: {
            'src/app/**/!(*.config|*.run|*.module).js': ['coverage'],
            'src/**/*.html': ['ng-html2js']
        }
    };

    config.set(configuration);
};
