-- Global keymaps (plugin-specific keymaps are in plugin configs)
vim.keymap.set("n", "<Esc>", "<cmd>nohlsearch<cr>", { desc = "Clear search highlight" })

-- map("n", ";", ":", { desc = "CMD enter command mode" })
-- jk/jj escape via better-escape plugin

-- map({ "n", "i", "v" }, "<C-s>", "<cmd> w <cr>")
vim.g.mapleader = " "
vim.keymap.set("n", "<C-n>", "<cmd>Neotree toggle reveal<cr>", { desc = "Neo-tree toggle" })
vim.keymap.set("n", "<C-Shift-n>", "<cmd>Neotree reveal<cr>", { desc = "Neo-tree reveal" })
vim.keymap.set("n", "<leader>s", vim.cmd.w)

vim.keymap.set("n", "sh", "<C-w>h")
vim.keymap.set("n", "sj", "<C-w>j")
vim.keymap.set("n", "sk", "<C-w>k")
vim.keymap.set("n", "sl", "<C-w>l")

vim.keymap.set("n", "ss", vim.cmd.split)
vim.keymap.set("n", "sv", vim.cmd.vsplit)

-- Make my life easier
vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv")
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv")

vim.keymap.set("n", "<C-d>", "<C-d>zz")
vim.keymap.set("n", "<C-u>", "<C-u>zz")

vim.keymap.set("x", "<leader>p", '"_dP')

vim.keymap.set("n", "<leader>y", '"+y')
vim.keymap.set("v", "<leader>y", '"+y')
vim.keymap.set("v", "<leader>Y", '"+Y')

vim.keymap.set("n", "<Tab>", ":tabn<CR>")
vim.keymap.set("n", "<S-Tab>", ":tabp<CR>")

vim.keymap.set("n", "<C-i>", "<C-i>")

-- vim.keymap.set("i", "{<CR>", "{<CR>}<Esc>ko<Tab>")
-- vim.keymap.set("i", "{", "{}<Esc>ha")
--
-- vim.keymap.set("i", "[<CR>", "[<CR>]<Esc>ko<Tab>")
-- vim.keymap.set("i", "[", "[]<Esc>ha")
--
-- vim.keymap.set("i", "(<CR>", "(<CR>)<Esc>ko<Tab>")
-- vim.keymap.set("i", "(", "()<Esc>ha")
--
-- vim.keymap.set("i", '"', '""<Esc>ha')
-- vim.keymap.set("i", "'", "''<Esc>ha")
-- vim.keymap.set("i", "`", "``<Esc>ha")
