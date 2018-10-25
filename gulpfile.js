'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var fs = require('fs-extra');
var argv = require('yargs').argv;
var dateFormat = require('dateformat');
var chalk = require('chalk');
var klawSync = require('klaw-sync')

/**
 *  This will load all js files in the gulp directory
 *  in order to load all gulp tasks
 */
klawSync('./build')
    .filter(function (file) {
        return (/\.(js)$/i).test(file.path);
    })
    .map(function (file) {
        require(file.path);
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

    // EEOC fields on apply form
    if (argv.eeocAll) {
        appConfig.eeoc.genderRaceEthnicity = argv.eeocAll;
    } else if (argv.eeocGenderRaceEthnicity) {
        appConfig.eeoc.genderRaceEthnicity = argv.eeocGenderRaceEthnicity;
    } else if (argv.eeocGRE) {
        appConfig.eeoc.genderRaceEthnicity = argv.eeocGRE;
    }

    if (argv.eeocAll) {
        appConfig.eeoc.veteran = argv.eeocAll;
    } else if (argv.eeocVeteran) {
        appConfig.eeoc.veteran = argv.eeocVeteran;
    } else if (argv.eeocV) {
        appConfig.eeoc.veteran = argv.eeocV;
    }

    if (argv.eeocAll) {
        appConfig.eeoc.disability = argv.eeocAll;
    } else if (argv.eeocDisability) {
        appConfig.eeoc.disability = argv.eeocDisability;
    } else if (argv.eeocD) {
        appConfig.eeoc.disability = argv.eeocD;
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
