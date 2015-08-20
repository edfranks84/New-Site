var gulp = require('gulp'),
    plumber = require("gulp-plumber"),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    notify = require("gulp-notify"),
    autoprefixer = require("gulp-autoprefixer"),
    browserSync = require("browser-sync"),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    reload  = browserSync.reload,
    rename = require('gulp-rename'),
    concat = require("gulp-concat"),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    svgSprite = require('gulp-svg-sprite'),
    cheerio = require('gulp-cheerio'),
    svgmin = require('gulp-svgmin'),
    svgo = require('gulp-svgo'),
    svgstore = require('gulp-svgstore'),
    pkg = require('./package.json');
 
gulp.task('connect', function() {
  connect.server({
    root: './index-case-studies.html',
    livereload: true
  });
});
 
gulp.task('html', function () {
  gulp.src('index-case-studies.html')
    .pipe(connect.reload());
});

gulp.task('sass', function() {
    gulp.src('assets/scss/**/*.scss')
    .pipe(sass({style: 'expanded', includePaths: [ './assets/scss/partials', './assets/scss/modules', './assets/scss/helpers' ], errLogToConsole: true }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(rename(pkg.name + '.css'))
    .pipe(gulp.dest('assets/css'))
    // .pipe(reload({stream: true}))
    .pipe(notify({message: 'SCSS processed!'}));
});

gulp.task('svgstore', function () {
    return gulp.src('assets/images/svg-sprite/*.svg')
      .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(svgstore())
        .pipe(rename('svgsprite.svg'))
        .pipe(gulp.dest('assets/images/svg-sprite'))
        .pipe(notify({message: 'svgs sprited!'}));
});

gulp.task('svgo', function() {
    return gulp.src('assets/images/svg/*.svg')
      .pipe(plumber())
        .pipe(svgo())
        .pipe(gulp.dest('assets/images/svg'))
        .pipe(notify({message: 'svgs minified!'}));
});

gulp.task('scripts', function() {
  return gulp.src(['assets/js/plugins/*.js', 'assets/js/src/*.js'])
    .pipe(plumber())
    .pipe(concat(pkg.name + '.js'))
    .pipe(gulp.dest('assets/js'))
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
    .pipe(notify({message: 'JS processed!'}));
});

gulp.task('images', function() {
  return gulp.src('assets/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/images'));
//    .pipe(notify({message: 'images minified'}));
});

gulp.task('serve', ['sass'], function() {

    browserSync({
        server: "./"
    });
    gulp.watch('assets/scss/**/*.scss', ['sass']);
    gulp.watch(['*.html', 'assets/css/**', 'assets/js/**']).on('change', reload);
});
 
// gulp.task('watch', function () {
//   gulp.watch(['*.html','assets/css/**', 'assets/js/**'], ['html']);
// });

gulp.task('default', ['connect', 'watch', 'serve']);

gulp.task('default', function () {
  gulp.start('scripts', 'sass', 'images', 'svgstore', 'svgo', 'serve');
  // Watch .js files
  gulp.watch('assets/js/src/*.js', ['scripts']);
   // Watch .scss files
  //gulp.watch('assets/scss/**/*.scss', ['sass']);
   // Watch image files
  gulp.watch('assets/images/**', ['images']);
   // Watch svg files
  gulp.watch('assets/images/svg/**', ['svgo', 'svgstore']);
});
