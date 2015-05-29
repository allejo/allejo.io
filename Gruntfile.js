module.exports = function(grunt) {
    // Load the libsass grunt task first and rename it because the ruby sass grunt task also has the same name for
    // initConfig().
    grunt.task.loadNpmTasks("grunt-sass");
    grunt.renameTask("sass", "libsass");

    // Load the rest of the tasks except for libsass that we already loaded manually
    require('load-grunt-tasks')(grunt, {
        pattern: [ 'grunt-*', '!grunt-sass' ]
    });

    grunt.initConfig({
        // Variables
        globalConfig: {
            sassDir: '_sass',
            targetCss: '_site/css',
            masterStyle: 'styles',
            cssPath: '<%= globalConfig.targetCss %>/<%= globalConfig.masterStyle %>.css',
            sassPath: '<%= globalConfig.sassDir %>/<%= globalConfig.masterStyle %>.scss'
        },

        // Grunt task settings
        jekyll: {
            options: {
                doctor: true,
                drafts: true
            },
            staging: {
                options: {
                    config: '_config.yml,_config_dev.yml',
                    serve: true,
                    watch: true
                }
            },
            production: {
                options: {
                    config: '_config.yml'
                }
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
        libsass: {
            options: {
                style: 'expanded',
                sourceMap: true,
                lineNumbers: true
            },
            debug: {
                files: {
                    '<%= globalConfig.cssPath %>': '<%= globalConfig.sassPath %>'
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
                    '<%= globalConfig.cssPath %>': '<%= globalConfig.sassPath %>'
                }
            }
        },
        scsslint: {
            allFiles: [
                '<%= globalConfig.sassDir %>/**/*.scss'
            ],
            options: {
                config: '.scss-lint.yml'
            }
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
                files: '<%= globalConfig.cssPath %>'
            },
            styles: {
                files: [
                    '<%= globalConfig.sassDir %>/**/*.scss',
                    '!<%= globalConfig.sassDir %>/vendor/**/*.scss'
                ],
                tasks: [ 'libsass', 'scsslint' ],
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

    grunt.registerTask('dist', [ 'sass', 'uglify', 'jekyll:production' ]);
    grunt.registerTask('default', [ 'libsass', 'jshint', 'jekyll:staging', 'watch' ]);
};
