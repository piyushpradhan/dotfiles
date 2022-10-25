local term = require('lspsaga.floaterm')

vim.keymap.set('n', '<A-d>', function() 
  term.open_float_terminal("zsh")
end, {silent = true})

vim.keymap.set('t', '<A-d>', function() 
  vim.fn.feedkeys(vim.api.nvim_replace_termcodes("<C-\\><C-n>", true, false, true))
  term.close_float_terminal()
end, {silent = true})
