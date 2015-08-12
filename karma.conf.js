'use strict';

var path = require('path');
var conf = require('./build/conf');

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
            path.join(conf.paths.karma, '/**/*.spec.js'),
            path.join(conf.paths.karma, '/**/*.mock.js'),
            path.join(conf.paths.src, '/**/*.html')
        ]);
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

        logLevel: 'INFO',

        frameworks: ['jasmine'],

        //preprocessors: {
        //    'src/app/**/*.js': ['coverage']
        //},

        reporters: ['progress'],

        browsers: ['PhantomJS']
    };

    config.set(configuration);
};
