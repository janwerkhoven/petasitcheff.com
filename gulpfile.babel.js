// Extract methods from Gulp
// https://gulpjs.com/docs/en/api/src
const { src, dest, series, parallel, watch } = require("gulp");

// Import plugins
// https://gulpjs.com/docs/en/getting-started/using-plugins
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const connect = require("gulp-connect");
const del = require("del");
const normalize = require("node-normalize-scss");
const nunjucksRender = require("gulp-nunjucks-render");
const prettify = require("gulp-jsbeautifier");
const rename = require("gulp-rename");
const sass = require("gulp-dart-sass");
const size = require("gulp-size");
const uglify = require("gulp-uglify");

// Removes the dist folder
function clean() {
  return del(["dist"]);
}

// Copies over all files from `src/public` as they are to `dist/`
function assets() {
  return src("src/public/**/*").pipe(dest("dist/"));
}

// Compiles all the HTML
function html() {
  return src("src/html/pages/**/*.+(html|njk)")
    .pipe(
      nunjucksRender({
        path: ["src/html"],
        data: {
          name: "Peta Sitcheff",
          url: "https://www.petasitcheff.com/",
          language: "en",
          themeColour: "#f4e207",
          googleSiteVerification: "VdGA9bCTfh6FFAALxprmdOSZVfsIHn5W5N3ksd0ZmlE"
        }
      })
    )
    .pipe(
      prettify({
        html: {
          indent_inner_html: true,
          indent_size: 2,
          max_preserve_newlines: 0
        }
      })
    )
    .pipe(dest("dist"));
}

// Compiles all the CSS
function css() {
  return src("src/css/main.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
        includePaths: normalize.includePaths
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        cascade: false,
        browsers: [
          "> 1% in AU",
          "Explorer > 9",
          "Firefox >= 17",
          "Chrome >= 10",
          "Safari >= 6",
          "iOS >= 6"
        ]
      })
    )
    .pipe(rename("main.min.css"))
    .pipe(dest("dist/assets/css"));
}

// Compiles all the JS
function js() {
  return src("src/js/main.js")
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(dest("dist/assets/js"));
}

// Reports an overview of the `dist/` folder
function report() {
  return src(["dist/**/*"]).pipe(
    size({
      showFiles: true,
      showTotal: false
    })
  );
}

// Spins up a localhost server on http://localhost:9000
function localhost() {
  connect.server({
    root: "dist",
    port: 9000
  });
}

// Watches the `src/` folder for file changes and fires tasks accordingly
// https://gulpjs.com/docs/en/getting-started/watching-files
function watchDist() {
  watch("src/public/**/*", assets);
  watch("src/html/**/*.njk", html);
  watch("src/css/**/*.scss", css);
  watch("src/js/**/*.js", js);
}

// Finally, create Gulp commands
// https://gulpjs.com/docs/en/getting-started/creating-tasks
exports.build = series(clean, parallel(assets, html, css, js), report);
exports.serve = parallel(localhost, watchDist);
