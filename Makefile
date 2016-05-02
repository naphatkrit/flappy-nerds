npm-requirements:
	npm install

bower-requirements: npm-requirements
	node_modules/.bin/bower install

develop: npm-requirements bower-requirements
