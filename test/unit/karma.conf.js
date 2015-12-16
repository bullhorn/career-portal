'use strict';

var path = require('path');
var conf = require('../../build/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

var pathSrcHtml = [
    path.join('../../' + conf.paths.src, '/**/*.html')
];

function listFiles() {
    var wiredepOptions = _.extend({}, '../../' + conf.wiredep, {
        dependencies: true,
        devDependencies: true
    });

    return wiredep(wiredepOptions).js
        .concat([
            path.join('../../' + conf.paths.tmp, '/serve/app/index.module.js')
        ])
        .concat(pathSrcHtml);
}

module.exports = function (config) {

    var configuration = {
        files: listFiles(),

        singleRun: true,

        autoWatch: false,

        ngHtml2JsPreprocessor: {
            stripPrefix: conf.paths.src + '/',
            moduleName: 'CareerPortal'
        },

        logLevel: 'WARN',

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-coverage',
            'karma-jasmine',
            'karma-mocha-reporter',
            'karma-ng-html2js-preprocessor'
        ],

        coverageReporter: {
            type: 'html',
            reporters: [
                {type: 'html', dir: '../../reports', subdir: 'coverage'},
                {type: 'lcov', dir: '../../reports', subdir: 'lcov'}
            ]
        },

        reporters: ['mocha']
    };

    // This is the default preprocessors configuration for a usage with Karma cli
    // The coverage preprocessor in added in gulp/unit-test.js only for single tests
    // It was not possible to do it there because karma doesn't let us now if we are
    // running a single test or not
    configuration.preprocessors = {};
    pathSrcHtml.forEach(function (path) {
        configuration.preprocessors[path] = ['ng-html2js'];
    });

    // This block is needed to execute Chrome on Travis
    // If you ever plan to use Chrome and Travis, you can keep it
    // If not, you can safely remove it
    // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
    if (configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
        configuration.customLaunchers = {
            'chrome-travis-ci': {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        };
        configuration.browsers = ['chrome-travis-ci'];
    }

    config.set(configuration);
};
