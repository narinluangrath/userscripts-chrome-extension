#!/bin/bash

NODE_ENV=development rm -rf dist/* && \
yarn run parcel build src/options.html --no-minify && \
yarn run parcel build src/popup.html --no-minify && \
yarn run parcel build src/background.ts --no-minify && \
yarn run parcel build src/content.ts --no-minify && \
cp -r manifest.json src/icons dist
