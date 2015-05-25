/// <reference path="typings/tsd.d.ts" />


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


function createTSTask(module_name) {
    
    
    var tsProject = ts.createProject(module_name + "/tsconfig.json", {});
    gulp.task(module_name, function () {

        var files = require("./" + module_name + "/tsconfig.json").workflowFiles.concat();
        
        console.log("files---" + files.length);
        
        var template = "/// <reference path=\"%1\" />\n";
        
        var fileData = "", filePath = "";
        for (var i = 0; i < files.length; i++) {

            filePath = files[i];

            /// if the first character is "!" then we'll strip it-
            ///  -add it to _references.ts but not pass it to the compiler.
            if (filePath.charAt(0) == "!") {

                filePath = filePath.substr(1);
                files[i] = "";
            }

            fileData += template.replace("%1", filePath.replace(module_name, ""));
            files[i] = module_name + "/" + files[i];
        }
        fs.writeFile(module_name + "_references.ts", fileData);

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
                    sourceRoot: "../" + module_name + "/"
                }))
                .pipe(gulp.dest("release/"))
        ]);
    });
}


function createTSWatch(module_name) {
    
    /// look out for ts changes, then kick off a build.
    gulp.watch([module_name + "/**.ts"], [module_name]);
}


gulp.task("default", [
    "bsync",
    "tsbuild"
], 
function () {
    
    createTSTask("base");
    createTSWatch("base");
});



var arg = process.argv[2];
if(arg) {
    
    createTSTask(arg);
}