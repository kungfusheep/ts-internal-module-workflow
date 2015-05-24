var gulp = require("gulp");
var ts = require("gulp-typescript");
var browserSync = require("browser-sync");
var merge = require("merge2");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat")
var fs = require("fs");



/// server

gulp.task("bsync", function () {

    browserSync.init({
        server: {
            baseDir: "./"
        },
        open: false
    });
});



var files = [
    "src/ClassTwo.ts",
    "src/ClassOne.ts",
    "src/main.ts"
];


var tsProject = ts.createProject("src/tsconfig.json", {});
gulp.task("tsbuild", function () {
    var tsResult = gulp.src(files)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest("release/")),

        tsResult.js
            .pipe(concat("output.js"))
            .pipe(sourcemaps.write(".", {
                includeContent: false,
                sourceMappingURLPrefix: function (file) {
                    return "/release/";
                },
                sourceRoot: "../src/"
            }))
            .pipe(gulp.dest("release/"))
    ]);
});

gulp.task("default", ["bsync", "tsbuild"], function () {

    /// look out for ts changes, then kick off a build.
    gulp.watch(["src/**.ts"], ["tsbuild"]);
});
