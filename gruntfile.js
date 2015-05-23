module.exports = function(grunt) {
    grunt.initConfig({
        bower: {
            restore: {
                options: {
                    cleanBowerDir: true,
                    cleanTargetDir: true,
                    layout: 'byComponent',
                    targetDir: 'lib'
                }
            }
        },
        clean: {
            compile: ['dist'],
            postcompile: ['.sass-cache'],
            reset: ['dist', 'lib', '.sass-cache', 'bower_components', 'node_modules']
        },
        copy: {
            compile: {
                dest: 'dist/',
                expand: true,
                src: [
                    '*.html',
                    'font/**/*',
                    'lib/**/*.js',
                    'lib/**/*.css',
                    'media/**/*.png',
                    'res/**/*.json',
                    'script**/*.js',
                    'style/**/*.css',
                    'view/**/*.html'
                ]
            }
        },
        jshint: {
            analyze: {
                expand: true,
                cwd: 'script/',
                src: '**/*.js',
                options: {
                    browser: true,
                    camelcase: true,
                    freeze: true,
                    indent: 4,
                    esnext: false,
                    globals: {
                        $: true,
                        angular: true,
                        require: true
                    },
                    laxbreak: true,
                    maxparams: 5,
                    maxdepth: 4,
                    newcap: true,
                    proto: true,
                    reporter: require('jshint-summary'),
                    undef: true,
                    unused: true,
                    white: true
                }
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            compile: {
                files: {
                    'dist/style/main.css': 'style/main.scss'
                }
            }
        },
        watch: {
            autobuild: {
                files: [
                    '*.html',
                    'media/**/*.png',
                    'res/**/*.json',
                    'script/**/*.js',
                    'style/**/*.scss',
                    'view/**/*.html'
                ],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            host: {
                options: {
                    base: 'dist',
                    hostname: 'portal.bh-bos2.bullhorn.local',
                    livereload: true,
                    port: 80
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('version', function() {
        var pkg = grunt.file.readJSON('package.json');
        var data = '';

        data += 'Project Name: ' + pkg.name + '\r\n';
        data += 'Build Date: ' + grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") + '\r\n';

        if (grunt.option('ji')) data += 'Jenkins Build Number: ' + grunt.option('ji') + '\r\n';
        if (grunt.option('gi')) data += 'Git Info: ' + grunt.option('gi') + '\r\n';

        grunt.file.write('dist/version.txt', data);
    });

    grunt.registerTask('reset', ['clean:reset']);
    grunt.registerTask('restore', ['bower:restore']);
    grunt.registerTask('analyze', ['jshint:analyze']);
    grunt.registerTask('compile', ['clean:compile', 'copy:compile', 'sass:compile', 'version', 'clean:postcompile']);
    grunt.registerTask('test', []); // TODO
    grunt.registerTask('pack', []); // TODO
    grunt.registerTask('min', []); // TODO

    grunt.registerTask('build', ['analyze', 'compile', 'test', 'pack', 'min']);
    grunt.registerTask('autobuild', ['watch:autobuild']);
    grunt.registerTask('host', ['restore', 'build', 'connect:host', 'autobuild']);
};
