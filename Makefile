default: typescript
	
npm-requirements:
	npm install

bower-requirements: npm-requirements
	node_modules/.bin/bower install

typings: npm-requirements
	node_modules/.bin/typings install

develop: npm-requirements bower-requirements typings

typescript:
	node_modules/.bin/tsc
