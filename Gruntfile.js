
module.exports = function(grunt) {
    var styles = grunt.file.expand(['src/**/*.css', '!src/library/tartJS/**/*']).map(function(file) {
        file = file.slice(4);
        return '<link rel="stylesheet" type="text/css" href="' + file + '" /> \n\t';
    }).join('');

	var config = {};

	config.clean = {
		dist: ['dist']
	};

	config.mkdir = {
		all: {
			options: {
				create: ['build', 'dist']
			}
		}
	};

	config.closureBuilder = {
		options: {
            builder: 'closure-library/goog/build/closurebuilder.py',
            namespaces: 'app.Bootstrapper',
            compilerFile: 'closure-library/goog/compiler/compiler.jar',
            output_mode: 'compiled',
            compile: true,
            compilerOpts: {
                compilation_level: 'ADVANCED_OPTIMIZATIONS',
                //compilation_level: 'WHITESPACE_ONLY',
                warning_level: 'verbose',
                formatting: 'PRETTY_PRINT',
                language_in: 'ECMASCRIPT5',
                generate_exports: true,
                charset: 'UTF-8',
                externs: ['externs.js'],
                jscomp_error: ['accessControls', 'checkRegExp', 'checkTypes', 'checkVars', 'invalidCasts',
                    'missingProperties', 'nonStandardJsDocs', 'strictModuleDepCheck', 'undefinedVars',
                    'unknownDefines', 'visibility'],
                jscomp_off: ['liskov']
            },
            execOpts: {
                maxBuffer: 999999 * 1024
            }
        },
        main: {
            src: ['closure-library/third_party', 'src/'],
            dest: 'build/compiled.js'
        }
	};

    config.closureDepsWriter = {
        options: {
            depswriter: 'closure-library/goog/build/depswriter.py', // filepath to depswriter
            root_with_prefix: '"src/ ../../../"'
        },
        main: {
            dest: 'build/deps.js'
        }
    };

    config.uglify = {
        options: {
            mangle: false
        },
        lib: {
            files: {
                'build/lib.js': ['src/lib/**/*.js']
            }
        }
    };

    config.concat = {
        js: {
            options: {
                separator: ';\n\n'
            },
            src: ['build/lib.js', 'build/compiled.js'],
            dest: 'dist/compiled.js'
        },
        css: {
            options: {
                separator: '\n'
            },
            src: ['src/**/*.css'],
            dest: 'dist/compiled.css'
        }
    };

    config.combine = {
        prod: {
            input: 'src/index.html',
            output: 'dist/index.html',
            tokens: [
                {
                    token: '<styleincludes/>',
                    string: '<link rel = "stylesheet" href = "compiled.css">'
                },
                {
                    token: '<scriptincludes/>',
                    string: '<script type="text/javascript" src="compiled.js"></script> \n\t'
                }
            ]
        },
        test: {
            input: 'src/index.html',
            output: 'dist/index.html',
            tokens: [
                {
                    token: '<styleincludes/>',
                    string: styles
                },
                {
                    token: '<scriptincludes/>',
                    string: '<script type="text/javascript" src="lib.js"></script> \n\t' +
                            '<script type="text/javascript" src="third_party/goog/goog/base.js"></script> \n\t' +
                            '<script type="text/javascript" src="deps.js"></script> \n\t' +
                            '<script type="text/javascript" src="Bootstrapper.js"></script>'
                }
            ]
        }
    };


    config.newer = {
        uglify: {
            src: ['src/lib/**/*.js'],
            dest: 'build/lib.js',
            options: {
                tasks: ['uglify:lib']
            }
        },
        closureBuilder: {
            src: ['src/**/*.js'],
            dest: 'build/compiled.js',
            options: {
                tasks: ['closureBuilder']
            }
        },
        closureDepsWriter: {
            src: ['src/**/*.js'],
            dest: 'build/deps.js',
            options: {
                tasks: ['closureDepsWriter']
            }
        }
    };

    config.copy = {
        lib: {
            files: [
                {src: 'build/lib.js', dest: 'dist/lib.js'}
            ]
        },
        jsbuild: {
            files: [
                {expand: false, cwd: 'build/', src: 'compiled.js', dest: 'dist/'}
            ]
        },
        jsdeps: {
            files: [
                {src: 'build/deps.js', dest: 'dist/deps.js'}
            ]
        },
        resources: {
            files: [
                {expand: true, cwd: 'src/', src:'rsc/**/*', dest: 'dist/'}
            ]
        }
    };

    config.symlink = {
        all: {
            files: [
                { expand: true, cwd: 'src', src: ['*', '!index.html'], dest: 'dist/' },
                { src: 'build/deps.js', dest: 'dist/deps.js' },
                { expand: true, cwd: 'closure-library', src: ['third_party/'], dest: 'dist/'}
            ]
        }
    };

	grunt.initConfig(config);

	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-closure-tools');
    grunt.loadNpmTasks('grunt-combine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-newer-explicit');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-symlink');

	grunt.registerTask('build', ['clean:dist', 'mkdir:all', 'closureBuilder']);
	grunt.registerTask('default', ['build']);


    grunt.registerTask('production', ['clean:dist', 'mkdir:all', 'newer:closureBuilder', 'newer:uglify', 'concat:js', 'concat:css', 'copy:resources', 'combine:prod']);

    grunt.registerTask('test', ['clean:dist', 'mkdir:all', 'newer:closureDepsWriter', 'newer:uglify', 'copy:lib', 'copy:jsdeps', 'symlink', 'combine:test']);
};