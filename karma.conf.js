'use strict';

var path = require('path');
var conf = require('./build/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

function listFiles() {
    var wiredepOptions = _.extend({}, 'lib', {
        dependencies: true,
        devDependencies: true
    });

    return wiredep(wiredepOptions).js
        .concat([
            'test/unit/**/*.spec.js',
            'test/unit/**/*.mock.js'
        ]);
}

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: listFiles(),

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/unit/**/*.spec.js': ["webpack"]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // reporters: ['mocha', 'coverage'],
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            dir: 'reports/',
            reporters: [
                {type: 'html', subdir: 'coverage'},
                {type: 'lcov', subdir: 'lcov'}
            ]
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Include timeout because of rsync
        autoWatchBatchDelay: 800,

        webpack: {
            resolve: {
                root: [__dirname]
            },
            module: {
                preLoaders: [
                    {
                        test: /(\.jsx)|(\.js)$/,
                        exclude: /(node_modules|bower_components|spec)/,
                        loader: 'isparta-instrumenter'
                    }
                ],
                loaders: [
                    {test: /(\.jsx)|(\.js)$/, exclude: /node_modules/, loader: 'babel'},
                    {test: /\.json$/, exclude: /node_modules/, loader: 'json-loader'}
                ]
            }
        },

        webpackMiddleware: {
            stats: {
                // With console colors
                colors: true,
                // add the hash of the compilation
                hash: false,
                // add webpack version information
                version: false,
                // add timing information
                timings: false,
                // add assets information
                assets: false,
                // add chunk information
                chunks: false,
                // add built modules information to chunk information
                chunkModules: false,
                // add built modules information
                modules: false,
                // add also information about cached (not built) modules
                cached: false,
                // add information about the reasons why modules are included
                reasons: false,
                // add the source code of modules
                source: true,
                // add details to errors (like resolving log)
                errorDetails: false,
                // add the origins of chunks and chunk merging info
                chunkOrigins: false,
                // Add messages from child loaders
                children: false
            }
        }
    });
};