'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
var babel = require('gulp-babel');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var fs = require('fs');
var argv = require('yargs').argv;
var dateFormat = require('dateformat');
var chalk = require('chalk');
var inject = require('gulp-inject');

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
    runSequence('clean', 'test', 'build', 'version', 'report:plato', done);
});

gulp.task('travis:build', function (done) {
    runSequence('clean', 'test', 'build', done);
});

gulp.task('config:app', function () {
    var appConfig = JSON.parse(fs.readFileSync('./src/app.json.template'));

    if (argv.corp || argv.corpToken) {
        appConfig.service.corpToken = argv.corp || argv.corpToken;
    } else {
        console.log(chalk.red('Argument for corpToken not found, output might not be setup correctly. Supply the corpToken via the --corp flag.'));
    }

    if (argv.sl) {
        appConfig.service.swimlane = argv.sl;
    } else {
        console.log(chalk.red('Argument for swimlane not found, output might not be setup correctly. Supply the swimlane via the --sl flag.'));
    }

    if (argv.companyName) {
        appConfig.companyName = argv.companyName;
    } else {
        console.log(chalk.red('Argument for companyName not found, output might not be setup correctly. Supply the companyName via the --companyName flag.'));
    }

    if (argv.port) {
        appConfig.service.port = argv.port;
    }

    // LinkedIn Integration
    if (argv.liClientId) {
        // Add LinkedIn source to <head>
        gulp.src('./src/index.html')
            .pipe(inject(gulp.src(['./src/index.html']), {
                starttag: '<!-- inject:integration:{{ext}} -->',
                transform: function () {
                    var html =  '<script type="text/javascript" src="//platform.linkedin.com/in.js">' + '\r\t'+
                        'api_key: ' + argv.liClientId + '\r' +
                        '</script>';
                    return html;
                }
            }))
            .pipe(gulp.dest('./src'));
        // Assign LinkedIn info to configuration object for use in NG
        appConfig.integrations.linkedin = {
            clientId: argv.liClientId
        };
    }

    fs.writeFileSync('src/app.json', JSON.stringify(appConfig, null, 4));
});

gulp.task('version', function () {
    var pkg = JSON.parse(fs.readFileSync('./package.json'));
    var data = '';

    data += 'Project Name: ' + pkg.name + '\r\n';
    data += 'Build Date: ' + dateFormat(new Date(), 'dddd, mmmm dS, yyyy, h:MM:ss TT') + '\r\n';

    if (argv.ji) {
        data += 'Jenkins Build Number: ' + argv.ji + '\r\n';
    }

    if (argv.gi) {
        data += 'Git Info: ' + argv.gi + '\r\n';
    }

    fs.writeFileSync('dist/version.txt', data);
});

// Temporary babel for plato, until plato supports ES6 (better then nothing for now)
gulp.task('babel', function () {
    gulp.src('src/app/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('.tmp/plato'));
});

gulp.task('report:plato', ['babel'], function (done) {
    exec('node_modules/plato/bin/plato -r -d reports/plato .tmp/plato/**/*.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        done(err);
    });
});
