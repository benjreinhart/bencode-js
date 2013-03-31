MOCHA=./node_modules/.bin/mocha
COFFEE=./node_modules/.bin/coffee

.PHONY: test

compile:
	$(COFFEE) -co ./lib ./src

watch:
	$(COFFEE) -cwo ./lib ./src

test:
	$(MOCHA) --compilers coffee:coffee-script --reporter spec --recursive --colors
