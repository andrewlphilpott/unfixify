var paths = {
  src: {
    dir: 'src',
    scssDir: 'src/scss',
    scssAll: 'src/scss/**/*.scss',
    jsDir: 'src/app',
    jsAll: 'src/app/**/*.js',
  },
  dest: {
    dir: 'public',
    css: 'public/static/css',
    js: 'public/static/js'
  }
};

// Include gulp
var gulp = require('gulp');

// Include Plugins
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify-es').default;
var watch = require('gulp-watch');

// Compile SASS
gulp.task('sass', function(){
  return gulp.src(paths.src.scssAll)
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
      outputStyle: 'compressed',
    }).on('error', function(err){
      console.log(err.toString());
      this.emit('end');
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(paths.dest.css))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

// Minify JS
gulp.task('scripts', function() {
  return gulp.src([
    '!' + paths.src.jsDir + '/*.min.js',
    paths.src.jsDir + '/*.js'
  ])
    .pipe(uglify())
    .on('error', function(err){
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(rename(function(path){
      path.basename += '.min';
      path.extname = '.js';
    }))
    .pipe(gulp.dest(paths.dest.js));
});

// BrowserSync
gulp.task('serve', function(){
  browserSync.init({
    server: './public',
    baseDir: paths.dest.dir,
    port: 3004
  });

  gulp.watch(paths.dest.js + '/*.js').on('change', reload);
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(paths.src.jsAll, ['scripts']);
  gulp.watch(paths.src.scssAll, ['sass']);
});

// Default Task
gulp.task('default', ['serve', 'sass', 'scripts', 'watch']);
