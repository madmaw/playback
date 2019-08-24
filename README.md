Template project for making a JS13K entry using TypeScript, Grunt, and minified using the Closure Compiler (which now supports fully-compressed ES6 output!)

It uses old-school `AMD` style, which means everything is global. No imports, use `\\\<reference path="lib.ts">` in the order you want them imported (ideally just do this once in `index.ts`) instead. Or change the module type, whatever suits you, but I believe `AMD` produces the smallest code.

To set up 
1. install NPM https://www.npmjs.com/get-npm
2. install Grunt CLI `npm install -g grunt-cli`
3. in the project folder type `npm install`

To run up the devekopment environment
1. type `grunt`
2. go to http://localhost:8000/ (and open the developer tools/console)
3. Any changes to the code/html/css should be automatically reloaded

To do a build to submit
1. type `grunt dist`
2. go to http://localhost:8000/dist to check it still works
3. compress (just) `dist/index.html` manually using advzip https://www.advancemame.it/comp-readme.html
4. submit!

NOTE: You might want to check that the substitutions in the `Gruntfile.js` `replace` task match what you want to have trimmed out of your HTML
