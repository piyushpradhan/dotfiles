local opts = { noremap = true, silent = true }
vim.keymap.set("n", "<C-l>", "?function<CR>:noh<CR><Plug>jsodc", opts)
