var gulp = require("gulp");
var ts = require("gulp-typescript");
var browserSync = require("browser-sync");
var merge = require("merge2");
var sourcemaps = require("gulp-sourcemaps")


/// server

gulp.task("bsync", function(){

	browserSync.init({
	    server: {
	        baseDir: "./"
	    },
	    open: false
	});
})


var tsProject = ts.createProject("src/tsconfig.json", {});
gulp.task("tsbuild", function() {
    var tsResult = gulp.src("src/_references.ts")
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest("release/")),

        tsResult.js
        .pipe(sourcemaps.write(".", {
            includeContent: false,
            sourceMappingURLPrefix: function(file) {
                return '/release/'
            },
            sourceRoot: "../src/"
        }))
        .pipe(gulp.dest("release/"))
    ]);
});

gulp.task("default", ["bsync"], function() {

    /// look out for ts changes, then kick off a build.
    gulp.watch(["src/**.ts"], ["tsbuild"]);
});
