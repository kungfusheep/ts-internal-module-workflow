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
var REFERENCES_TS = "/_references.ts";
var TSCONFIG = "/tsconfig.json";


/// projects need to appear in here to have tasks created. 'all' is executed in this order.
var buildOrder = [
  "base",
  "TestModule"  
];



/**
 * Generate a TypeScript build task.
 */
function createTSTask(module_name) {
    
    
    var tsProject = ts.createProject(module_name + TSCONFIG, {/* overrides */});
    gulp.task(module_name, function () {

        var files = require("./" + module_name + TSCONFIG).workflowFiles.concat();
        
        ///
        logVerbose("files list: " + files);
        
        
        /// -generate _references from `workflowFiles`
        /// -replace any project tokens with _references & the d.ts file.  
        var fileData = "", 
            filePath, 
            projectName;
        for (var i = 0; i < files.length; i++) {

            filePath = files[i];

            /// if the first character is "!" then we know this is a project reference.
            if (filePath.charAt(0) == "!") {

                /// external module syntax detected, pull it apart.
                projectName = filePath.substr(2, filePath.length-3);
                
                /// pass this to compiler by placing it back into the list
                files[i] = "../" + projectName + OUTPUT_FOLDER + projectName + ".d.ts";
                /// and this to _references.ts
                filePath = "../" + projectName + REFERENCES_TS;
            }

            fileData += "/// <reference path=\"" + filePath.replace("./" + module_name + "/", "") +"\" />\n";
            if(files[i]) files[i] = "./" + module_name + "/" + files[i];
        }
        fs.writeFile(module_name + REFERENCES_TS, fileData);
        ///
        logVerbose("files to compiler: " + files);


        /// the ts build
        var tsResult = gulp.src(files)
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));
            
        /// process the output.
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


/**
 * Generate a TS project watch task.
 */
function createTSWatch(module_name) {
    
    /// look out for ts changes, then kick off a build.
    gulp.watch(["./" + module_name + "/**.ts", 
                "!./" + module_name + "/**" + module_name + ".d.ts",
                "!./" + module_name + "/_references.ts",                
        ], [module_name]);
}



/// server
gulp.task("bsync", function () {

    browserSync.init({
        server: {
            baseDir: "./"
        },
        open: false
    });
});


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


gulp.task("all", function(){
    var runSequence = require("run-sequence");
    
    /// create build and watch tasks for all in the build order list.
    for (var i = 0; i < buildOrder.length; i++) {
        var element = buildOrder[i];
        
        createTSTask(element);
    }
    
    runSequence(buildOrder);
});


/// support for dynamic creation of a task
var arg = process.argv[2];
if(arg && buildOrder.indexOf(arg) > -1) {
    
    createTSTask(arg);
}