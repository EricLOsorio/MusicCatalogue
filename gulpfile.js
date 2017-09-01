var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    pump = require('pump'),
    cssmin = require('gulp-cssmin'),
    runSequence = require('run-sequence'),
    jshint = require('gulp-jshint');

gulp.task('build', function(callback) {

  runSequence('minifyCSS', 'jslint', 'minifyJS', callback);

});


gulp.task('minifyJS', function() {

  return browserify({entries: ['./music.js', './music_tracks.js'], extensions: ['.js'],debug: true})
         .transform("babelify", {presets: ["es2015"] })
	 .bundle()
	 .pipe(source('bundle.js'))
	 .pipe(buffer())
	 .pipe(uglify())
	 .pipe(gulp.dest('dest'));

}),


gulp.task('minifyCSS', function () {

  gulp.src('./*.css')
      .pipe(cssmin() )
      .pipe(gulp.dest('./dest'));
});

gulp.task('jslint', function () {

  return gulp.src("./jscript.js")
             .pipe(eslint() )
	     .pipe(eslint.format() )
	     .pipe(eslint.failAfterError() );

});

gulp.task('jshint', function() {

  return gulp.src(['./music.js','./music_tracks.js'])
             .pipe(jshint())
	     .pipe(jshint.reporter('default'));

});
