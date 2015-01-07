/*
 *
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', ['build']);  

gulp.task('build', function() {  
  var scripts = [
    './src/mario.js',
    './src/player.js',
    './src/block.js',
  ];
  gulp.src(scripts)
    .pipe(concat('mario.js'))
    .pipe(gulp.dest('./'))
    .pipe(uglify())
    .pipe(rename({
      extname: ".min.js",
    }))
    .pipe(gulp.dest('./'))
    ;
});


