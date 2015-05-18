


var gulp = require("gulp");
var ts = require("gulp-typescript");
var browserSync = require("browser-sync");
var merge = require("merge2");


/// server
browserSync.init({
    server: {
        baseDir: "./"
    },
    open: false
});


 
var tsProject = ts.createProject("src/tsconfig.json",{

});
 
gulp.task("tsbuild", function() {
    var tsResult = gulp.src("src/_references.ts")
                    .pipe(ts(tsProject));
 
    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        tsResult.dts.pipe(gulp.dest("release/")),
        tsResult.js.pipe(gulp.dest("release/"))
    ]);
});
gulp.task("watch", ["tsbuild"], function() {
    gulp.watch("src/**.ts", ["tsbuild"]);
});



gulp.task("default",["watch"], function() {
    
    // ja
});
