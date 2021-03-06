.PHONY: test test-node test-browser test-all-browsers watch dist clean

# Test files
TESTS?=test/*.js

# Default Zuul Vars
DEFAULT_BROWSER_NAME?=chrome
DEFAULT_BROWSER_VERSION?=latest

BROWSERIFY?=./node_modules/.bin/browserify

SRC_FILES?=$(wildcard src/**.js)

default: build

build: node_modules

node_modules: package.json
	npm install
	touch $@

test: build
	@if [ "x$(BROWSER_NAME)" = "x" ]; then make test-node; else make test-browser; fi

# Run a dev server to check out the browser examples/
server: build dist
	./node_modules/.bin/http-server

# Run tests just in node for speed. Default of `make test`
test-node:
	@npm test

# This will be run via `make test` when travis-ci runs
# or `BROWSER_NAME=ie BROWSER_VERSION=latest make test-browser`
# or just `make test-browser` will test in chrome@latest
test-browser:
ifdef BROWSER_NAME
	./node_modules/zuul/bin/zuul \
		--browser-name $(BROWSER_NAME) \
		--browser-version $(BROWSER_VERSION) \
		$(TESTS);
else
	./node_modules/zuul/bin/zuul \
		--browser-name $(DEFAULT_BROWSER_NAME) \
		--browser-version $(DEFAULT_BROWSER_VERSION) \
		$(TESTS);
endif

# Test all the browsers in the sauce labs cloud. requires ~/.zuulrc
test-all-browsers:
	./node_modules/zuul/bin/zuul $(TESTS)

# Watch {src,test} and re-run tests when they change
watch:
	npm run watch

# browserify and build into dist
dist: build $(SRC_FILES)
	mkdir -p dist
	make dist/livefyre-geo-collection.js
	make dist/livefyre-geo-collection.min.js
	make dist/livefyre-geo-collection.min.js.gz
	make dist/livefyre-geo-collection.lf.js
	make dist/livefyre-geo-collection.lf.min.js
	make dist/livefyre-geo-collection.lf.min.js.gz


# dev JS
dist/livefyre-geo-collection.js: $(SRC_FILES)
	mkdir -p dist
	./node_modules/.bin/browserify -s Livefyre.GeoCollection -r ./index.js:livefyre-geo-collection >> dist/livefyre-geo-collection.js

dist/livefyre-geo-collection.lf.js: $(SRC_FILES)
	mkdir -p dist
	cat tools/wrap-start.frag > dist/livefyre-geo-collection.lf.js
	./node_modules/.bin/browserify -r ./index.js:livefyre-geo-collection >> dist/livefyre-geo-collection.lf.js
	cat tools/wrap-end.frag >> dist/livefyre-geo-collection.lf.js	

# uglified JS
dist/livefyre-geo-collection.min.js: dist/livefyre-geo-collection.js
	cat dist/livefyre-geo-collection.js | ./node_modules/.bin/uglifyjs > dist/livefyre-geo-collection.min.js


# uglified JS
dist/livefyre-geo-collection.lf.min.js: dist/livefyre-geo-collection.js
	cat dist/livefyre-geo-collection.lf.js | ./node_modules/.bin/uglifyjs > dist/livefyre-geo-collection.lf.min.js


dist/livefyre-geo-collection.min.js.gz: dist/livefyre-geo-collection.min.js
	gzip -9 < dist/livefyre-geo-collection.min.js > dist/livefyre-geo-collection.min.js.gz

dist/livefyre-geo-collection.lf.min.js.gz: dist/livefyre-geo-collection.lf.min.js
	gzip -9 < dist/livefyre-geo-collection.lf.min.js > dist/livefyre-geo-collection.lf.min.js.gz

clean:
	rm -rf dist

clean-deps:
	rm -rf node_modules
