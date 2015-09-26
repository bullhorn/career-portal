var gulp = require('gulp');
var concat = require('gulp-concat');
var es = require('event-stream');
var gutil = require('gulp-util');
var path = require('path');

function cacheTranslations() {
    return es.map(function (file, callback) {
        file.contents = new Buffer(gutil.template('$translateProvider.translations("<%= language %>", <%= contents %>);\n', {
            contents: file.contents,
            file: file,
            language: file.path.split(path.sep).pop().match(/^(?:[\w]{3,}-)?([a-z]{2}[_|-]?(?:[A-Z]{2})?)\.json$/i).pop()
        }));
        callback(null, file);
    });
}

function wrapTranslations() {
    return es.map(function (file, callback) {
        file.contents = new Buffer(gutil.template('function translations($translateProvider) {\n"ngInject";\n<%= contents %>}\n\nexport default translations', {
            contents: file.contents,
            file: file
        }));
        callback(null, file);
    });
}

function createTranslationsFile() {
    return es.pipeline(cacheTranslations(), concat('index.translations.js'), wrapTranslations());
}

gulp.task('translations', function () {
    return gulp.src('src/i18n/*.json')
        .pipe(createTranslationsFile())
        .pipe(gulp.dest('src/app'));
});