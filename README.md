# flappy-nerds

## Development
### Prerequisites
First, install `npm`, a package manager we will need. Go to https://nodejs.org/en/ and install `npm` using the official nodejs installer.

Next, install the project dependencies:
```
make develop
```

Internally, this first runs `npm install`, which installs `bower` and `tsc`. `bower` is the package manager for javascript libraries. `tsc` is the typescript compiler. Next, it runs `node_modules/.bin/bower install`, which downloads javascript libraries to `bower_components/`.
