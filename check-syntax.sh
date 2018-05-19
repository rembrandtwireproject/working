#!/bin/sh

find _pages -name "*.html" -depth 2 -print0 | xargs -0 yamllint -d yamllint.cfg