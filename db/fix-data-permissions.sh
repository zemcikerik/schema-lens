#!/usr/bin/env bash

pushd "$(dirname "${BASH_SOURCE%/*}")"

[ -d ./data ] || mkdir ./data
[ -d ./backups ] || mkdir ./backups
chown -R 54321:54321 ./data
chown -R 54321:54321 ./backups

popd
