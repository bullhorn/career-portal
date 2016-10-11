'use strict';

let path = require('path');
let gulp = require('gulp');
let conf = require('./conf');

let karma = require('karma');

let pathSrcHtml = [
    path.join('../../' + conf.paths.src, '/**/*.html')
];

let pathSrcJs = [
    path.join('../../' + conf.paths.tmp, '/serve/app/index.module.js')
];

function runTests(singleRun, done) {
    let reporters = ['mocha'];
    let preprocessors = {};

    pathSrcHtml.forEach(function (path) {
        preprocessors[path] = ['ng-html2js'];
    });

    if (singleRun) {
        pathSrcJs.forEach(function (path) {
            preprocessors[path] = ['coverage'];
        });
        reporters.push('coverage')
    }

    let localConfig = {
        configFile: path.join(__dirname, '/../test/unit/karma.conf.js'),
        singleRun: singleRun,
        autoWatch: !singleRun,
        reporters: reporters,
        preprocessors: preprocessors
    };

    let server = new karma.Server(localConfig, function (failCount) {
        done(failCount ? new Error("Failed " + failCount + " tests.") : null);
    });

    server.start();
}

gulp.task('test', ['scripts:test'], function (done) {
    runTests(true, done);
});

gulp.task('test:auto', ['scripts:test-watch'], function (done) {
    runTests(false, done);
});
