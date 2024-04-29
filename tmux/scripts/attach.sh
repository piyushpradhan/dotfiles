#!/bin/sh

# List tmux sessions, pass them to fzf, and extract the selected session name
session=$(tmux list-sessions | fzf | cut -d ':' -f1)

# Attach selected tmux session
tmux attach-session -t "${session}"
