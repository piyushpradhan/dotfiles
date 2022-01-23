#!/bin/bash

# kill all running polybar instances
killall -q polybar

# Launching a new bar
# echo "---" | tee -a /tmp/default_bar.log 
polybar bar 2>&1 | tee -a /tmp/polybar1.log & disown

# polybar --config=/home/piyush/.config/polybar/config example

