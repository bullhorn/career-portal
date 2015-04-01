module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Linting Options
        jshint: {
            files: ['gruntfile.js', 'resources/js/**/*.js'],
            options: {
                asi: true,
                expr: true,
                sub: true,
                loopfunc: true
            }
        },

		sass: {
			dist: {
			  files: {
				'resources/css/main.css': 'resources/scss/main.scss'
			  }
			}
		  },
		watch: {
			styles: {
				files: ['resources/**/*.scss','resources/**/*.js','./*.html','resources/**/*.html'],
				tasks: ['sass'],
				options: {
				  livereload: true
				}
			}
		},
        connect: {
			server: {
			  options: {
				port: 9001,
				hostname: 'localhost',
                livereload: 35729
			  }
			}
		},

        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
				singleRun: true
            }
        }
    });

    grunt.registerTask("default", [
        'jshint',
        'sass'
    ]);

    grunt.registerTask('serve', [
		'default',
		'connect',
		'watch'
	]);
};
