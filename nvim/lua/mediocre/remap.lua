vim.g.mapleader = " "
-- vim.keymap.set("n", "<leader>pv", vim.cmd.Ex)
vim.keymap.set("i", "jk", "<Esc>")
vim.keymap.set("n", "<leader>s", vim.cmd.w)

vim.keymap.set("n", "sh", "<C-w>h")
vim.keymap.set("n", "sj", "<C-w>j")
vim.keymap.set("n", "sk", "<C-w>k")
vim.keymap.set("n", "sl", "<C-w>l")

vim.keymap.set("n", "ss", vim.cmd.split)
vim.keymap.set("n", "sv", vim.cmd.vsplit)

vim.keymap.set("i", "{<CR>", "{<CR>}<Esc>ko<Tab>")
vim.keymap.set("i", "{", "{}<Esc>ha")

vim.keymap.set("i", "[<CR>", "[<CR>]<Esc>ko<Tab>")
vim.keymap.set("i", "[", "[]<Esc>ha")

vim.keymap.set("i", "(<CR>", "(<CR>)<Esc>ko<Tab>")
vim.keymap.set("i", "(", "()<Esc>ha")

vim.keymap.set("i", '"', '""<Esc>ha')
vim.keymap.set("i", "'", "''<Esc>ha")
vim.keymap.set("i", "`", "``<Esc>ha")
