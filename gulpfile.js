'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
var babel = require('gulp-babel');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var fs = require('fs-extra');
var argv = require('yargs').argv;
var dateFormat = require('dateformat');
var chalk = require('chalk');

/**
 *  This will load all js files in the gulp directory
 *  in order to load all gulp tasks
 */
// TODO: 'wrench' is deprecated
wrench.readdirSyncRecursive('./build')
    .filter(function (file) {
        return (/\.(js)$/i).test(file);
    })
    .map(function (file) {
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
        // Assign LinkedIn info to configuration object for use in NG
        appConfig.integrations.linkedin = {
            clientId: argv.liClientId
        };
    }

    // EEOC fields on apply form
    appConfig.eeoc = appConfig.eeoc || {};
    appConfig.eeoc.genderRaceEthnicity = (argv.eeocAll === 'true' || argv.eeocGenderRaceEthnicity === 'true' || argv.eeocGRE === 'true');
    appConfig.eeoc.veteran = (argv.eeocAll === 'true' || argv.eeocVeteran === 'true' || argv.eeocV === 'true');
    appConfig.eeoc.disability = (argv.eeocAll === 'true' || argv.eeocDisability === 'true' || argv.eeocD === 'true');

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
