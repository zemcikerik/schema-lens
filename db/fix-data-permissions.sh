#!/usr/bin/env bash

pushd "$(dirname "${BASH_SOURCE%/*}")"

[ -d ./data ] || mkdir ./data
chown -R 54321:54321 ./data

popd
