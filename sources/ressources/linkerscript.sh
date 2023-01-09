#!/bin/bash

## This script is called to link all ressources for testing
## testing/document-root shall have all ressources available as if it was the real document-root on deployment

pushd testing/document-root

ln -sfT ../../sources/ressources/font font
ln -sfT ../../sources/ressources/img img
ln -sfT ../../sources/ressources/audio audio
ln -sfT ../../sources/ressources/video video

ln -sf ../../sources/ressources/manifest/* .
ln -sf ../../sources/ressources/favicon/* .

popd

echo 0
