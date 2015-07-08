module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var server = {
        hostname: 'localhost',
        port: 9001,
        protocol: 'http'
    };

    var debugUrl = [server.protocol, ['//', server.hostname].join(''), server.port].join(':');

    grunt.initConfig({
        babel: {
            compile: {
                dest: 'dist/',
                expand: true,
                src: 'script/**/*.js',
                options: {
                    modules: 'amd'
                }
            }
        },
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
        connect: {
            host: {
                options: {
                    base: 'dist',
                    protocol: server.protocol,
                    hostname: server.hostname,
                    livereload: true,
                    port: server.port
                }
            }
        },
        copy: {
            compile: {
                dest: 'dist/',
                expand: true,
                src: [
                    '*.html',
                    'font/**',
                    'lib/**',
                    'media/**',
                    'res/**',
                    'view/**',
                    'app.json'
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
                    esnext: true,
                    globals: {
                        $: true,
                        angular: true,
                        define: true,
                        require: true
                    },
                    laxbreak: true,
                    //maxparams: 5,
                    maxdepth: 4,
                    newcap: true,
                    proto: true,
                    reporter: require('jshint-summary'),
                    undef: false,
                    unused: true,
                    white: true
                }
            }
        },
        open: {
            chrome: {
                app: 'Chrome',
                path: debugUrl
            },
            firefox: {
                app: 'Firefox',
                path: debugUrl
            },
            ie: {
                app: 'iexplore',
                path: debugUrl
            },
            safari: {
                app: 'Safari',
                path: debugUrl
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
            debug: {
                files: [
                    '*.html',
                    'media/**',
                    'res/**',
                    'script/**',
                    'style/**',
                    'view/**',
                    'app.json'
                ],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            }
        }
    });

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
    grunt.registerTask('compile', ['clean:compile', 'copy:compile', 'babel:compile', 'sass:compile', 'version', 'clean:postcompile']);
    grunt.registerTask('test', []); // TODO
    grunt.registerTask('pack', []); // TODO
    grunt.registerTask('min', []); // TODO

    grunt.registerTask('build', ['analyze', 'compile', 'test', 'pack', 'min']);
    grunt.registerTask('host', ['restore', 'build', 'connect:host']);

    grunt.registerTask('debug:chrome', ['host', 'open:chrome', 'watch:debug']);
    grunt.registerTask('debug:firefox', ['host', 'open:firefox', 'watch:debug']);
    grunt.registerTask('debug:ie', ['host', 'open:ie', 'watch:debug']);
    grunt.registerTask('debug:safari', ['host', 'open:safari', 'watch:debug']);
    grunt.registerTask('debug', ['debug:chrome']);
};
