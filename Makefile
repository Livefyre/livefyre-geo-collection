.PHONY: test test-node test-browser test-all-browsers watch

# Test files
TESTS?=test/*.js

# Default Zuul Vars
DEFAULT_BROWSER_NAME?=chrome
DEFAULT_BROWSER_VERSION?=latest

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
