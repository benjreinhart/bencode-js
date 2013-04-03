BIN=./node_modules/.bin

MOCHA=$(BIN)/mocha
COFFEE=$(BIN)/coffee
CJSIFY=$(BIN)/cjsify

.PHONY: test

compile:
	$(COFFEE) -co ./lib ./src

watch:
	$(COFFEE) -cwo ./lib ./src

browserify:
	$(CJSIFY) --export Bencode ./index.js -o ./bencode.js

browserify-min:
	$(CJSIFY) --minify --export Bencode ./index.js -o ./bencode-min.js

test:
	$(MOCHA) --compilers coffee:coffee-script --reporter spec --recursive --colors
