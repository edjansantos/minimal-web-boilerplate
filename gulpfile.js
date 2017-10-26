/* 
  Name: Minimal Web Boilerplate
  Desc: Gulp file with tasks to build the dist app.
  Author: Edjan Santos

 */

// setting up the refers
const gulp  = require('gulp'),
      gutil = require('gulp-util'),
      sourcemaps = require('gulp-sourcemaps'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      shell = require('gulp-shell'),
      sass = require('gulp-sass'),
      browserSync = require('browser-sync');

let jsDependencies = [
    'src/js/**/*.js'
]; 

let cssDependencies = [
    'src/assets/styles/**/*.scss',
    'src/assets/styles/**/*.css'
];   

let fontsDependencies = [
    'node_modules/font-awesome/fonts/**.**'
];

let anotherFiles = [
    'src/**/*.json'
]

let imagesFiles = [
    'src/assets/images/**/*.png',
]

let distPath = 'dist';

// If you want remove sass support, use this to build your css files
gulp.task('build-styles', function() {
    return gulp.src(cssDependencies)
                .pipe(sourcemaps.init())
                .on('error', gutil.log)
                .pipe(concat('style.css'))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(distPath+'/assets/styles'))
                .pipe(browserSync.reload({stream: true}));
});

// Build your javascript files
gulp.task('build-js', function() {
  return gulp.src(jsDependencies)
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(distPath+'/js'));
});    

// Copy 
gulp.task('copy-fonts', function () {
     return gulp
             .src(fontsDependencies)
             .pipe(gulp.dest(distPath+'assets/fonts'));
});

// Copy HTML files
gulp.task('copy-html', function () {
     return gulp
             .src(['src/**/*.html', 'src/**/*.htm'])
             .pipe(gulp.dest(distPath));
});

// Copy image files
gulp.task('copy-images', function () {
     return gulp
             .src(imagesFiles)
             .pipe(gulp.dest(distPath+'/assets/images'));
});


// Copy another files
gulp.task('copy-resources', function () {
     return gulp
             .src(anotherFiles)
             .pipe(gulp.dest(distPath));
});

// Browsersync configurations
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "dist/"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});

//basically just keeping an eye on all HTML files
gulp.task('html', function() {
    //watch any and all HTML files and refresh when something changes
    return gulp.src('src/**/*.html')
        .pipe(browserSync.reload({stream: true}))
        .on('error', gutil.log);
});

// Task to clean dist folder
gulp.task('clean', shell.task([
  'rm -rf dist'
]));


// Task to compile your sass files 
gulp.task('build-sass', function () {
 return gulp.src(cssDependencies)
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(concat('style.css'))
   .pipe(gulp.dest(distPath+'/assets/styles'))
   .pipe(browserSync.reload({stream: true}));
});

// Watch changes in your files and start the browsersync server
gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['build-js']);
  gulp.watch(['src/assets/styles/**/*.css', 'src/assets/styles/**/*.scss'], ['build-styles']);
  gulp.watch(['src/**/*.html'], ['copy-html']);
  gulp.watch("src/**/*.html").on('change', browserSync.reload);
  gulp.watch("src/**/*.css").on('change', browserSync.reload);

  gulp.start('default');
});

// Build your app 
gulp.task('build', ['copy-html', 'html', 'build-js', 'build-sass', 'copy-images', 'copy-resources', 'copy-fonts']);

gulp.task('default', ['browserSync', 'build']);