local keymapper = vim.keymap.set
local key_mapping = function(mode, key, op)
	keymapper(mode, key, op, { noremap = true })
end

vim.g.mapleader = " "

key_mapping('i', 'jk', '<Esc>')
key_mapping('n', '<S-C-p>', '\"+p')

-- Delete without yanking
key_mapping('n', 'x', '\"_x')

-- Delete a word backwards
key_mapping('n', 'dw', 'vb\"_d')

-- Tabs
key_mapping('n', 'te', ':tabedit')
key_mapping('n', '<S-Tab>', ':tabprev<CR>')
key_mapping('n', '<Tab>', ':tabnext<CR>')

-- Window navigation
key_mapping('n', 'ss', ':split<CR><C-w>w')
key_mapping('n', 'sv', ':vsplit<CR><C-w>h')

key_mapping('n', 'sh', '<C-w>h')
key_mapping('n', 'sk', '<C-w>k')
key_mapping('n', 'sj', '<C-w>j')
key_mapping('n', 'sl', '<C-w>l')

-- Resize window
key_mapping('n', 's<Left>', '<C-w><')
key_mapping('n', 's<up>', '<C-w>+')
key_mapping('n', 's<down>', '<C-w>-')
key_mapping('n', 's<right>', '<C-w>>')

-- Shifting lines
key_mapping('v', 'J', ':m \'>+1<CR>gv=gv')
key_mapping('v', 'K', ':m \'>-2<CR>gv=gv')

-- Save current buffer
key_mapping('n', '<leader>s', ':w<CR>')

-- Move Window
key_mapping('n', '<S-s>j', '<C-w>J')
key_mapping('n', '<S-s>k', '<C-w>K')
key_mapping('n', '<S-s>l', '<C-w>L')
key_mapping('n', '<S-s>h', '<C-w>H')

-- Expand window
key_mapping('n', 'sL', ':vertical resize 160<CR>')
key_mapping('n', 'sH', ':vertical resize 100<CR>')
key_mapping('n', 'sJ', ':resize 25<CR>')
key_mapping('n', 'sK', ':resize 160<CR>')

-- Search vim for help for the word cursor is on
key_mapping('n', '<leader>ghw', ':h <C-R>=expand("<cword>")<CR><CR>')

-- Shows the undo tree
key_mapping('n', '<leader>u', ':Undotreeshow<CR>')

-- Shoutout to the init.lua
key_mapping('n', '<Space><CR>', ':luafile ~/.config/nvim/init.lua<CR>')

-- Map auto complete of parentheses and stuff
-- key_mapping('i', '(', '()<Esc>i')
-- key_mapping('i', '[', '[]<Esc>i')
-- key_mapping('i', '{', '{}<Esc>i')
-- key_mapping('i', '{<CR>', '{<CR>}<Esc><S-o>')
-- key_mapping('i', '\'', '\'\'<Esc>i')
-- key_mapping('i', '\"', '\"\"<Esc>i')

-- C++ compilation shortcut
key_mapping('n', '<leader>cpp', ':!g++ %;./a.out<CR>')

-- Java compilation shortcut
key_mapping('n', '<leader>ja', ':!java %<CR>')

-- Python run script shortcut
key_mapping('n', '<leader>py', ':!python3 %<CR>')
