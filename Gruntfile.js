module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    './public/lib/styles/main.min.css': './public/src/styles/main.scss'
                }
            }
        },

        uglify: {
            options: {
                preserveComments: false
            },
            my_target: {
                files: {
                    './public/lib/js/app.min.js': ['./public/lib/js/app.js'],
                    './public/lib/js/vendor.min.js': ['./public/lib/js/vendor.js']
                }
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                files: {
                    './public/lib/js/app.js': [
                      './public/src/js/app.js',
                      './public/src/js/services/socket.service.js',
                      './public/src/js/controllers/*.js'
                    ],
                    './public/lib/js/vendor.js': [
                      './public/src/js/vendor/socket.io.js',
                      './public/src/js/vendor/jquery.js',
                      './public/src/js/vendor/angular.js',
                      './public/src/js/vendor/angular-ui-router.js',
                      './public/src/js/vendor/angular-local-storage.js'
                    ]
                }
            }
        },

        // imagemin: {
        //     dynamic: {
        //         options: {
        //             optimizationLevel: 3
        //         },
        //         files: [
        //             {
        //                 expand: true,
        //                 cwd: 'images/',
        //                 src: ['**/*.{png,jpg,gif,svg}'],
        //                 dest: 'images/'
        //             }
        //         ]
        //     }
        // },

        // jshint: {
        //     all: ['Gruntfile.js', 'src/*.js', 'test/*.js']
        // },

        // mochaTest: {
        //     test: {
        //         options: {
        //             reporter: 'spec',
        //             captureFile: 'test/results.txt',
        //             quiet: false,
        //             clearRequireCache: false,
        //             noFail: false
        //         },
        //         src: ['test/**/*.js']
        //     }
        // },

        // babel: {
        //     options: {
        //         sourceMap: true,
        //         presets: ['es2015']
        //     },
        //     dist: {
        //         files: {
        //             'src/js/main.js': 'src/js/main.js'
        //         }
        //     }
        // },

        watch: {
            css: {
                files: ['./public/src/styles/**/*'],
                tasks: ['sass']
            },

            javascript: {
                files: [
                    './public/src/js/**/*', 'test/*.js'
                ],
                tasks: [
                  // 'mochaTest', 'jshint',
                  'concat', 'uglify'
                ]
            }

            // img: {
            //     files: ['images/**/*'],
            //     tasks: ['imagemin']
            // }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    // grunt.loadNpmTasks('grunt-mocha-test');
    // grunt.loadNpmTasks('grunt-babel');
    grunt.registerTask('default', [
        'sass',
        'watch',
        // 'imagemin',
        'concat',
        'uglify'
        // 'jshint',
        // 'mochaTest',
        // 'babel'
    ]);
};
