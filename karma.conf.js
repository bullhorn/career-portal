'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

function listFiles() {
    var wiredepOptions = _.extend({}, conf.wiredep, {
        dependencies: true,
        devDependencies: true
    });

    return wiredep(wiredepOptions).js
        .concat([
            path.join(conf.paths.tmp, '/serve/app/index.module.js'),
            path.join(conf.paths.src, '/**/*.spec.js'),
            path.join(conf.paths.src, '/**/*.mock.js'),
            path.join(conf.paths.src, '/**/*.html'),
            {
                pattern: 'src/app.json',
                watched: true,
                served: true,
                included: false
            }
        ]);
}

module.exports = function (config) {

    var configuration = {
        files: listFiles(),

        singleRun: true,

        autoWatch: false,

        debug: true,

        frameworks: ['jasmine'],

        ngHtml2JsPreprocessor: {
            stripPrefix: 'src/',
            moduleName: 'careerPortalNew'
        },

        browsers: ['PhantomJS'],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor'
        ],

        preprocessors: {
            'src/**/*.html': ['ng-html2js']
        }
    };

    config.set(configuration);
};
