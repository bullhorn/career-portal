'use strict';

let path = require('path');
let gulp = require('gulp');
let conf = require('./conf');

let $ = require('gulp-load-plugins')();

let wiredep = require('wiredep').stream;
let _ = require('lodash');

gulp.task('inject', ['scripts', 'styles'], function () {
    let injectStyles = gulp.src([
        path.join(conf.paths.tmp, '/serve/app/**/*.css'),
        path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
    ], {read: false});

    let injectScripts = gulp.src([
        path.join(conf.paths.tmp, '/serve/app/**/*.module.js')
    ], {read: false});

    let injectOptions = {
        ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
        addRootSlash: false
    };

    return gulp.src(path.join(conf.paths.src, '/*.html'))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
