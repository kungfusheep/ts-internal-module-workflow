/// <reference path="typings/tsd.d.ts" />


var gulp = require("gulp");
var ts = require("gulp-typescript");
var browserSync = require("browser-sync");
var merge = require("merge2");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var cleants = require("gulp-clean-ts-extends");
var uglify = require("gulp-uglify");
var fs = require("fs");
var gulpif = require("gulp-if");

/// server
gulp.task("bsync", function () {

    browserSync.init({
        server: {
            baseDir: "./"
        },
        open: false
    });
});



//========================================================================


var verboseMode = process.argv.indexOf("--verbose") > -1;
var releaseMode = process.argv.indexOf("--release") > -1;

/**
 * logs to the console if we're in --verbose mode
 */
function logVerbose(out){
    if(verboseMode) console.log(out);
}
logVerbose("Verbose Mode.");




//========================================================================

var OUTPUT_FOLDER = "/build/";


var buildOrder = [
  "base",
  "TestModule"  
];



function createTSTask(module_name) {
    
    
    var tsProject = ts.createProject(module_name + "/tsconfig.json", {/* overrides */});
    gulp.task(module_name, function () {

        var files = require("./" + module_name + "/tsconfig.json").workflowFiles.concat();
        
        logVerbose("files list: " + files);
        
        
        var referencesPath = "/_references.ts";
        var template = "/// <reference path=\"%1\" />\n";
        
        
        var fileData = "", filePath = "";
        for (var i = 0; i < files.length; i++) {

            filePath = files[i];

            /// if the first character is "!" then we"ll strip it-
            ///  -add it to _references.ts but not pass it to the compiler.
            if (filePath.charAt(0) == "!") {

                /// external module syntax detected, pull it apart.
                filePath = filePath.substr(2, filePath.length-3);
                
                /// pass this to compiler
                files[i] = "../" + filePath + OUTPUT_FOLDER + filePath + ".d.ts";
                /// and this to _references.ts
                filePath = "../" + filePath + referencesPath;   
            }

            fileData += template.replace("%1", filePath.replace("./" + module_name + "/", ""));
            if(files[i]) files[i] = "./" + module_name + "/" + files[i];
        }
        fs.writeFile(module_name + referencesPath, fileData);
        
        logVerbose("files to compiler: " + files);

        var tsResult = gulp.src(files)
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

        return merge([
            tsResult.dts
                .pipe(concat(module_name + ".d.ts"))
                .pipe(gulp.dest("./" + module_name + OUTPUT_FOLDER)),
            tsResult.js
                .pipe(concat(module_name + ".js"))
                .pipe(cleants())
                // if we're in release mode, uglify, else sourcemaps
                .pipe( gulpif(releaseMode, 
                    uglify(),  
                    sourcemaps.write(".", {
                        includeContent: false,
                        sourceMappingURLPrefix: function (file) {
                            return "/" + module_name + OUTPUT_FOLDER;
                        },
                        sourceRoot: "/" + module_name + "/"
                    })
                ))
                .pipe(gulp.dest("./" + module_name + OUTPUT_FOLDER))
        ]);
    });
}


function createTSWatch(module_name) {
    
    /// look out for ts changes, then kick off a build.
    gulp.watch(["./" + module_name + "/**.ts", 
                "!./" + module_name + "/**output.d.ts",
                "!./" + module_name + "/_references.ts",                
        ], [module_name]);
}


/// default task
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


/// support for dynamic creation of a task
var arg = process.argv[2];
if(arg && buildOrder.indexOf(arg) > -1) {
    
    createTSTask(arg);
}