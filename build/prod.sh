#!/bin/bash

rm -rf dist/* && \
yarn run parcel build src/options.html && \
yarn run parcel build src/popup.html && \
yarn run parcel build src/background.ts && \
yarn run parcel build src/content.ts && \
cp -r manifest.json src/icons dist
