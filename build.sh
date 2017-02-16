#!/bin/sh
env HUGO_ENV="DEV" hugo server --watch --buildDrafts=true --buildFuture=true -t aglaus
