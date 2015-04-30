.PHONY: test test-node test-browser test-all-browsers watch dist clean

# Test files
TESTS?=test/*.js

# Default Zuul Vars
DEFAULT_BROWSER_NAME?=chrome
DEFAULT_BROWSER_VERSION?=latest

BROWSERIFY?=./node_modules/.bin/browserify

SRC_FILES?=$(wildcard src/**.js)

test:
	@if [ "x$(BROWSER_NAME)" = "x" ]; then make test-node; else make test-browser; fi

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
dist:
	mkdir -p dist
	make dist/livefyre-geo-collection.js
	make dist/livefyre-geo-collection.min.js

# dev JS
dist/livefyre-geo-collection.js: $(SRC_FILES)
	mkdir -p dist
	cat tools/wrap-start.frag > dist/livefyre-geo-collection.js
	./node_modules/.bin/browserify -r ./index.js:livefyre-geo-collection >> dist/livefyre-geo-collection.js
	cat tools/wrap-end.frag >> dist/livefyre-geo-collection.js	

dist/livefyre-geo-collection.lf.js:
	# TODO

# uglified JS
dist/livefyre-geo-collection.min.js: dist/livefyre-geo-collection.js
	cat dist/livefyre-geo-collection.js | ./node_modules/.bin/uglifyjs > dist/livefyre-geo-collection.min.js

clean:
	rm -rf dist
