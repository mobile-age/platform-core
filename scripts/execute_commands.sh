#!/bin/bash

. scripts/container_actions.sh


$1 $2 $3
x=$?
echo $x