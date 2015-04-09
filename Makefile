JSHINT=@./node_modules/jshint/bin/jshint
MOCHA=@./node_modules/.bin/mocha

lint:
	 $(JSHINT) lib/ test/ index.js

test: lint
	$(MOCHA)

coverage: lint
	$(MOCHA) -R html-cov > coverage.html
