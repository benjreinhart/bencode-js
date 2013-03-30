MOCHA=./node_modules/.bin/mocha

.PHONY: test

test:
	$(MOCHA) --compilers coffee:coffee-script --reporter spec --recursive --colors
