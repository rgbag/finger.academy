#!/bin/bash

## This script is called to copy all ressources
## Destination is basicly the output/ module
## The output module is the document-root of what is served on deployment

mkdir -p output/font
mkdir -p output/img
mkdir -p output/audio
mkdir -p output/video

## app files
cp sources/ressources/font/* output/font/
cp sources/ressources/img/* output/img/
cp sources/ressources/audio/* output/audio/
cp sources/ressources/video/* output/video/

cp sources/ressources/favicon/* output/
cp sources/ressources/manifest/* output/

echo 0
