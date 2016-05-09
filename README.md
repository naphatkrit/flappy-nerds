# flappy-nerds
This project is hosted at http://flappy-nerds.herokuapp.com.
## Project Writeup
A detailed project description, including different pieces used and features implemented, can be found under ***Writeup.pdf***.

## Development
### Prerequisites
First, install `npm`, a package manager we will need. Go to https://nodejs.org/en/ and install `npm` using the official nodejs installer.

Next, install the project dependencies:
```
make develop
```

Internally, this first runs `npm install`, which installs `bower` and `tsc`. `bower` is the package manager for javascript libraries. `tsc` is the typescript compiler. Next, it runs `node_modules/.bin/bower install`, which downloads javascript libraries to `bower_components/`.


### TypeScript
This project uses TypeScript, a superset of JavaScript with type safety. TypeScript files (`<name>.ts`) get compiled down to JavaScript files (`<name>.js`), which then gets loaded by the browser regularly. Note that we should treat JavaScript files as compiled object files, i.e. they should NOT be checked into the repo. The exception is some of the starter code we adapted from COS 426 Assignment 4, which are already in JavaScript.

For a quick intro to TypeScript, see http://www.typescriptlang.org/docs/tutorial.html.

The text editor you are using probably has a TypeScript plugin, which will make your life much, much easier. A crucial feature is that it detects any compile-time error in real time as you type your code, so you can fix them right away. It can also usually autocomplete your code for you. If you use Atom, use [atom-typescript](https://atom.io/packages/atom-typescript). If you are using Sublime, use the [official plugin from Microsoft](https://github.com/Microsoft/TypeScript-Sublime-Plugin). For other text editors, check out the TypeScript [home page](http://www.typescriptlang.org/).

To compile TypeScript files:
```
make typescript
```

Remember to do this every time you want to test your code change. But if you are using a plugin, odds are it is already compiling on save, so you never have to run this command.

#### TypeScript Is Getting In the Way And I Don't Want to Deal With Type Errors!!

If you run into compile-time issues and need to get in a quick fix, you can always cast the variable to `<any>`, which basically tells the TypeScript compiler that you know what you are doing. For example,

```
var x = 5;
x.someMethod();
```

This code will not compile, because `x` is a number. But if for some reason you know that this code will work, you can do:

```
var x: any = 5;
x.someMethod();
```

Or:

```
var x = 5;
(<any> x).someMethod();
```

#### I Know That a Global Variable Exists, But TypeScript is Complaining!!
If you know that a global variable exists, you can tell the TypeScript compiler using `declare`. This statement gets removed on compilation, but is used by the compiler to understand the type of a variable.

```
declare var x: number
x + 5
```

Omitting the type defaults to `any`.
```
declare var x
x + 5
```
