var gulp        = require('gulp');

var postcss     = require('gulp-postcss');
var reporter    = require('postcss-reporter');
var syntax_scss = require('postcss-scss');
var stylelint   = require('stylelint');

gulp.task("scss:lint", function() {
    var processors = [
        stylelint(),
        reporter({
            clearMessages: true,
            throwError: true
        })
    ];

    return gulp.src([
            'sass/**/*.scss',
            '!sass/vendor/**/*.scss']
        )
        .pipe(postcss(processors, { syntax: syntax_scss }));
});
