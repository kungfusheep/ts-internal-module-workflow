# ts-internal-module-workflow


## About
A TypeScript workflow built on top of gulp/node, aimed for writing internal modules over multiple 'projects' at scale. (And fixes 'go to definition'!)

By using adopting this workflow you get; 

- The concept of a TypeScript library project! (see 'Usage' below)
- `gulp-typescript`'s incremental builds 
- Generic watch/build tasks for all projects. 
- Project build-order - `gulp all`. 
- `BrowserSync` set up and ready. 
- SourceMaps when not in release mode. 
- Minification in release mode using `UglifyJS`. 
- Generation of `_references.ts`. 

## Getting Started

	git clone http://github.com/kungfusheep/ts-internal-module-workflow
	cd ts-internal-module-workflow
	npm install
	

## Usage
	
You can see from the couple of example projects left in the folder structure how things are structured. We're using `tsconfig.json` for the individual projects, but we've got a custom file list avaialabile in the form of `workflowFiles`.

What `workflowFiles` gives us is a) Standard file ordering for the combine (nothing special...) and b) the ability to link to other projects.

Linking to other projects is done using the `!{PROJECT_NAME}` syntax. This gives us a couple of things...
- It populates `_references.ts` with an entry linking to `PROJECT_NAME`'s own `_references.ts` file - so 'go to definition' actually goes to the definition, not a `d.ts` file! `_references.ts` is then the sole entry in this projects `files` array in `tsconfig.json`.
- It sends `PROJECT_NAME.d.ts` to the compiler along with all the other files listed in `workflowFiles`, so the external project isn't compiled into our build output. 

This esentially gives us the concept of a TypeScript library project. It also makes no assertions on how your codebase loads its code in production, that's left up to your preference.
 

## Options

At the moment there are only a couple of custom options

- `--release` Minifies the build output and turns off sourcemaps. 
- `--verbose` Turns on a bit of extra logging. 


## Contributing

If you like the idea of this and want to contribute to making it better, please do give me a shout.
