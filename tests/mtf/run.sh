#!/bin/sh
cd "$(dirname "$0")"
node validate-mtf.mjs "$@"
