# Put system-wide fish configuration entries here
# or in .fish files in conf.d/
# Files in conf.d can be overridden by the user
# by files with the same name in $XDG_CONFIG_HOME/fish/conf.d

# This file is run by all fish instances.
# To include configuration only for login shells, use
# if status is-login
#    ...
# end
# To include configuration only for interactive shells, use
# if status is-interactive
#   ...
# end

function fish_greeting
  node ~/projects/personal/cli/aniquotes/quote-generator.js
end

funcsave fish_greeting

alias ls "exa -l -g --icons"
alias lla "ll -a"

alias tree "exa -T --icons"

alias idb "wine ~/.wine/drive_c/Program\ Files\ \(x86\)/Immunity\ Inc/Immunity\ Debugger/ImmunityDebugger.exe"

alias yt "ytfzf -t --preview-side=right"
alias r "ranger"

alias icat "kitty +kitten icat"

# Apply theme using pywal 
alias applyTheme "$HOME/.config/polybar/scripts/apply_theme.sh"

# PATH
export TODO_DIR="$HOME/.todo"

# DEFAULT EDITOR
set EDITOR "nvim"
set VISUAL "nvim"
