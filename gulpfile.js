'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
var babel = require('gulp-babel');
var plato = require('gulp-plato');
var runSequence = require('run-sequence');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./build').filter(function (file) {
    return (/\.(js)$/i).test(file);
}).map(function (file) {
    require('./build/' + file);
});

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('jenkins:build', function (done) {
    runSequence('clean', 'build', 'test:jenkins', 'protractor:jenkins', done);
});

// Temporary babel for plato, until plato supports ES6 (better then nothing for now)
gulp.task('babel', function () {
    gulp.src('src/app/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('.tmp/plato'));
});

gulp.task('plato', ['babel'], function () {
    gulp.src('.tmp/plato/**/*.js')
        .pipe(plato('reports/plato', {
            jshint: {
                options: {}
            },
            complexity: {
                trycatch: true
            }
        }));
});