module.exports = function(grunt) {
    grunt.task.loadNpmTasks("grunt-sass");
    grunt.renameTask("sass", "libsass");

    require('load-grunt-tasks')(grunt, {
        pattern: [ 'grunt-*', '!grunt-sass' ]
    });

    grunt.initConfig({
        'check-gems': {
            dist: {
                files: [{
                    src: '.'
                }]
            }
        },
        jekyll: {
            serve: {
                options: {
                    doctor: true,
                    drafts: true,
                    serve: true
                }
            }
        },
        libsass: {
            options: {
                style: 'expanded',
                sourceMap: true,
                lineNumbers: true
            },
            debug: {
                files: {
                    '_site/css/styles.css': '_sass/styles.scss'
                }
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none',
                    require: 'sass-media_query_combiner'
                },
                files: {
                    '_site/css/styles.css': '_sass/styles.scss'
                }
            }
        },
        scsslint: {
            allFiles: [
                '_sass/**/*.scss'
            ],
            options: {
                config: '.scss-lint.yml'
            }
        },
        jshint: {
            options: {
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
                reporter: require('jshint-stylish')
            },
            all: ['Gruntfile.js']
        },
        uglify: {
            options: {
                mangle: true
            },
            dist: {
                files: {}
            }
        },
        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            scripts: {
                files: [ ],
                tasks: [ 'js' ],
                options: {
                    spawn: true
                }
            },
            css: {
                files: [ 'web/assets/css/styles.css' ]
            },
            styles: {
                files: [
                    'web/assets/css/**/*.scss',
                    '!web/assets/css/vendor/**/*.scss'
                ],
                tasks: [ 'libsass' ],
                options: {
                    livereload: false,
                    spawn: true
                }
            },
            views: {
                files: [ '_pages', '_layouts', '_includes' ],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('css', [ 'sass:dist' ]);
    grunt.registerTask('js', [ 'jshint', 'uglify' ]);
    grunt.registerTask('default', [ 'css', 'js' ]);
};
