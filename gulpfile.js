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
    gutil = require('gulp-util'),
    scsslint = require('gulp-scss-lint'),
    pkg = require('./package.json');
 


var reportError = function (error) {
    var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

    notify({
        title: 'Task Failed [' + error.plugin + ']',
        message: lineNumber + 'See console.',
        sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).write(error);

    gutil.beep(); // Beep 'sosumi' again

    // Inspect the error object
    //console.log(error);

    // Easy error reporting
    //console.log(error.toString());

    // Pretty error reporting
    var report = '';
    var chalk = gutil.colors.white.bgRed;

    report += chalk('TASK:') + ' [' + error.plugin + ']\n';
    report += chalk('PROB:') + ' ' + error.message + '\n';
    if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
    if (error.fileName)   { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }
    console.error(report);

    // Prevent the 'watch' task from stopping
    this.emit('end');
}



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
    .pipe(plumber({
        errorHandler: reportError
    }))
    .pipe(sass({style: 'expanded', includePaths: [ './assets/scss/partials', './assets/scss/modules', './assets/scss/helpers' ], errLogToConsole: true }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(rename(pkg.name + '.css'))
    .pipe(gulp.dest('assets/css'))
    // .pipe(reload({stream: true}))
    .pipe(notify({message: 'SCSS processed!'}));
});

gulp.task('scss-lint', function() {
  return gulp.src('assets/scss/**/*.scss')
    .pipe(scsslint());
});

gulp.task('svgstore', function () {
    return gulp.src(['assets/images/svg-sprite/*.svg','!assets/images/svg-sprite/svgsprite.svg'])
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
  //return gulp.src(['assets/js/plugins/*.js', 'assets/js/src/*.js'])
  return gulp.src('assets/js/plugins/*.js')
    .pipe(plumber({
        errorHandler: reportError
    }))
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
