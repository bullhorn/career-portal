'use strict';

let path = require('path');
let gulp = require('gulp');
let conf = require('./conf');

let browserSync = require('browser-sync');

let $ = require('gulp-load-plugins')();

let wiredep = require('wiredep').stream;
let _ = require('lodash');

gulp.task('styles', function () {
    let sassOptions = {
        style: 'expanded'
    };

    let injectFiles = gulp.src([
        path.join(conf.paths.src, '/app/**/*.scss'),
        path.join('!' + conf.paths.src, '/app/index.scss')
    ], {read: false});

    let injectOptions = {
        transform: function (filePath) {
            filePath = filePath.replace(conf.paths.src + '/app/', '');
            return '@import "' + filePath + '";';
        },
        starttag: '// injector',
        endtag: '// endinjector',
        addRootSlash: false
    };


    return gulp.src([
        path.join(conf.paths.src, '/app/index.scss')
    ])
        .pipe($.inject(injectFiles, injectOptions))
        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')))
        .pipe(browserSync.reload({stream: true}));
});
