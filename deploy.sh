#!/usr/bin/env bash

set -e
set -o pipefail

branch=$(git rev-parse --abbrev-ref HEAD)
revision=$(git rev-parse --short HEAD)

echo "----------"
echo "Deploying:"
echo $branch
echo $revision
echo "----------"
echo "scp install.sh deploy@server-singapore.nabu.io:/var/www/petasitcheff.com"
scp install.sh deploy@server-singapore.nabu.io:/var/www/petasitcheff.com
echo "----------"
echo 'ssh deploy@server-singapore.nabu.io "/var/www/petasitcheff.com/install.sh $branch $revision"'
ssh deploy@server-singapore.nabu.io "/var/www/petasitcheff.com/install.sh $branch $revision"
