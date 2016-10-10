'use strict';

let path = require('path');
let gulp = require('gulp');
let conf = require('./conf');

let browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('watch', ['scripts:watch', 'inject'], function () {

    gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject']);

    gulp.watch([
        path.join(conf.paths.src, '/app/**/*.css'),
        path.join(conf.paths.src, '/app/**/*.scss')
    ], function (event) {
        if (isOnlyChange(event)) {
            gulp.start('styles');
        } else {
            gulp.start('inject');
        }
    });


    gulp.watch([
        path.join(conf.paths.src, '/app/**/*.html'),
        path.join(conf.paths.src, '/res/**/*.json')
    ], function (event) {
        browserSync.reload(event.path);
    });
});
