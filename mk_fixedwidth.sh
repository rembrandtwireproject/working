#!/bin/sh
cd $1
[ -d fixedwidth ] || mkdir fixedwidth > /dev/null
mogrify -resize 400 -path fixedwidth *.png
