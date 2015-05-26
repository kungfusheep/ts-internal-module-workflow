/// <reference path="typings/tsd.d.ts" />


var gulp = require("gulp");
var ts = require("gulp-typescript");
var browserSync = require("browser-sync");
var merge = require("merge2");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var cleants = require("gulp-clean-ts-extends");
var fs = require("fs");

/// server
gulp.task("bsync", function () {

    browserSync.init({
        server: {
            baseDir: "./base"
        },
        open: false
    });
});


var buildOrder = [
  "base",
  "TestModule"  
];


function createTSTask(module_name) {
    
    
    var tsProject = ts.createProject(module_name + "/tsconfig.json", {/* overrides */});
    gulp.task(module_name, function () {

        var files = require("./" + module_name + "/tsconfig.json").workflowFiles.concat();
        
        console.log("files--1 " + files);
        
        var template = "/// <reference path=\"%1\" />\n";
        
        var fileData = "", filePath = "";
        for (var i = 0; i < files.length; i++) {

            filePath = files[i];

            /// if the first character is "!" then we"ll strip it-
            ///  -add it to _references.ts but not pass it to the compiler.
            if (filePath.charAt(0) == "!") {

                /// external module syntax detected, pull it apart.
                filePath = filePath.substr(2, filePath.length-3);
                
                files[i] = "../" + filePath + "/release/output.d.ts";
                filePath = "../" + filePath + "/_references.ts";   
            }

            fileData += template.replace("%1", filePath.replace("./" + module_name + "/", ""));
            if(files[i]) files[i] = "./" + module_name + "/" + files[i];
        }
        fs.writeFile(module_name + "/_references.ts", fileData);
        
        console.log("files--2 " + files);

        var tsResult = gulp.src(files)
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

        return merge([
            tsResult.dts
                .pipe(concat("output.d.ts"))
                .pipe(gulp.dest("./" + module_name + "/release/")),
            tsResult.js
                .pipe(concat("output.js"))
                .pipe(cleants())
                .pipe(sourcemaps.write(".", {
                    includeContent: false,
                    sourceMappingURLPrefix: function (file) {
                        return module_name + "/release/";
                    },
                    sourceRoot: "../" + module_name + "/"
                }))
                .pipe(gulp.dest("./" + module_name + "/release/"))
        ]);
    });
}


function createTSWatch(module_name) {
    
    /// look out for ts changes, then kick off a build.
    gulp.watch(["./" + module_name + "/**.ts", 
                "!./" + module_name + "/**.d.ts",
                "!./" + module_name + "/_references.ts",                
        ], [module_name]).
    on("change", function(handle){
         console.log(handle);
    })
}


gulp.task("default", [
    "bsync"
], 
function () {
    
    
    /// create build and watch tasks for all in the build order list.
    for (var i = 0; i < buildOrder.length; i++) {
        var element = buildOrder[i];
        
        createTSTask(element);
        createTSWatch(element);
    }
});


var arg = process.argv[2];
if(arg) {
    
    createTSTask(arg);
}