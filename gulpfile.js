const gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  cleancss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  notify = require("gulp-notify"),
  rsync = require('gulp-rsync'),
  plumber = require('gulp-plumber'),
  compileHandlebars = require('gulp-compile-handlebars'),
  trim = require('gulp-trim'),
  sourcemaps = require('gulp-sourcemaps'),
  del = require('del');

gulp.task('clean',
  del.bind(null, ['./.tmp'], {
    dot: true
  })
);

const config = {
  server: ['./.tmp'],
  startPath: '/html/',
  tunnel: true,
  host: 'localhost',
  port: 3000,
  logPrefix: "Egor_Patsyno"
};
gulp.task('html', function() {
  const data = {
      j_title: ''
    },
    options = {
      ignorePartials: true,
      batch: [
        'app/html/layouts',
        'app/html/partials'
      ],
      helpers: {
        times: function(n, block) {
          var accum = '';
          for (var i = 0; i < n; ++i)
            accum += block.fn(i + 1);
          return accum;
        },
        ifCond: function(v1, v2, options) {
          if (v1 === v2) {
            return options.fn(this);
          }
          return options.inverse(this);
        }
      }
    };

  return gulp.src([
      'app/html/**/*.hbs',
      '!app/html/layouts/**/*.hbs',
      '!app/html/partials/**/*.hbs'
    ])
    .pipe(plumber())
    .pipe(compileHandlebars(data, options))
    .pipe(rename(path => {
      path.extname = ".html"
    }))
    .pipe(trim())
    .pipe(gulp.dest('./.tmp/html'))
    .pipe(browserSync.stream());
});

gulp.task('styles', function() {
  return gulp.src('app/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on("error", notify.onError()))
    .pipe(rename({
      suffix: '.min',
      prefix: ''
    }))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleancss({
      level: {
        1: {
          specialComments: 0
        }
      }
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./.tmp/css'))
    .pipe(browserSync.stream())
});

gulp.task('js', function() {
  return gulp.src([
    "app/js/libs/jquery/dist/jquery.min.js",
      'app/js/common.js',
      "app/js/libs/slick/slick.min.js",
      "app/js/index.js"
    ])
    .pipe(concat('scripts.min.js'))
    // .pipe(uglify()) // Mifify js (opt.)
    .pipe(gulp.dest('./.tmp/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});
gulp.task('image', gulp.series(function(cb) {
  gulp.src("app/img/*.*")
    .pipe(gulp.dest('./.tmp/img'))
    .pipe(browserSync.reload({
      stream: true
    }));
  cb();
}));
gulp.task('rsync', function() {
  return gulp.src('dist/**')
    .pipe(rsync({
      root: 'dist/',
      hostname: 'username@yousite.com',
      destination: 'yousite/public_html/',
      // include: ['*.htaccess'], // Includes files to deploy
      exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
      recursive: true,
      archive: true,
      silent: false,
      compress: true
    }))
});
gulp.task('webserver', function() {
  browserSync(config);
});
gulp.task('fonts', function() {
  return gulp.src('./app/fonts/**/*').pipe(gulp.dest('./.tmp/fonts'))
});
gulp.task('dist', function() {
  return gulp.src('./.tmp/**/*').pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', gulp.series("styles"));
  gulp.watch("app/js/**/*.js", gulp.series("js"));
  gulp.watch('app/html/**/*.*', gulp.series('html'));
  gulp.watch("app/img/*.*", gulp.series('image'));
});
gulp.task('dev', gulp.series(
  gulp.parallel('clean'),
  gulp.parallel('styles', 'html', 'js', 'fonts','image'),
  gulp.parallel('watch', 'webserver')
));
gulp.task('build', gulp.series(

  gulp.parallel('dist'),
    gulp.parallel('clean')
));
