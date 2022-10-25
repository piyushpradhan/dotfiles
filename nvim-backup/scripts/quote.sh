#!/bin/sh

curl --silent "https://animechan.vercel.app/api/random" | jq ".quote"
