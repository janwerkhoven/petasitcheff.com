#!/usr/bin/env bash

set -e
set -o pipefail

user=jw
host=sydney.floatplane.dev
domain=petasitcheff.com
repo=git@github.com:janwerkhoven/petasitcheff.com.git

echo "----------"
echo "Setting up remote server for:"
echo $user
echo $host
echo $domain
echo $repo
echo "----------"

(
  set -x
  scp remote/setup-remote.sh $user@$host:~/
  ssh -t $user@$host "~/setup-remote.sh $domain $repo"
)
