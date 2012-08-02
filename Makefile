TEST_DIR = test
VOWS = ./node_modules/vows/bin/vows

all: test

test:
	@@${VOWS} ${TEST_DIR}/*-test.js

.PHONY: all test
