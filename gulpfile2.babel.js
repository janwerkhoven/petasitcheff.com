const babel = require("gulp-babel");
const concat = require("gulp-concat");
const connect = require("gulp-connect");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const uglify = require("gulp-uglify");

// Lint app JS, warn about bad JS, break on errors
gulp.task("lintJs", function() {
  return gulp
    .src(["src/js/app.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Create temp/scripts.js
// Transform app JS with Babel ES6 + minify
gulp.task("transformAndMinifyJs", function() {
  return gulp
    .src(["src/js/app.js"])
    .pipe(babel({ presets: ["es2015"] }))
    .pipe(rename("scripts.js"))
    .pipe(gulp.dest("temp"))
    .pipe(uglify({ preserveComments: "license" }))
    .pipe(rename("scripts.min.js"))
    .pipe(gulp.dest("temp"));
});

// Create scripts.js
// Merge the vendor JS and app JS (unminified)
gulp.task("concatJs", function() {
  return gulp
    .src([
      "bower_components/jquery/dist/jquery.min.js",
      "bower_components/velocity/velocity.min.js",
      "src/js/vendor/google-analytics.js",
      "temp/scripts.js"
    ])
    .pipe(
      concat("scripts.js"),
      { newLine: "\n\n" }
    )
    .pipe(gulp.dest("dist/assets/js"))
    .pipe(connect.reload());
});

// Create scripts.min.js
// Merge the vendor JS and minified app JS
gulp.task("concatJsMin", function() {
  return gulp
    .src([
      "bower_components/jquery/dist/jquery.min.js",
      "bower_components/velocity/velocity.min.js",
      "src/js/vendor/google-analytics.js",
      "temp/scripts.min.js"
    ])
    .pipe(
      concat("scripts.min.js"),
      { newLine: "\n\n\n\n" }
    )
    .pipe(replace(/^\s*\r?\n/gm, ""))
    .pipe(gulp.dest("dist/assets/js"))
    .pipe(connect.reload());
});

// Compile all JS
gulp.task(
  "compileJs",
  gulp.series(
    gulp.series("lintJs", "transformAndMinifyJs"),
    gulp.parallel("concatJs", "concatJsMin", "copyOutdatedBrowser")
  )
);
