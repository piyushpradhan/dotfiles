local curl = require('luacurl')

local M = {}

local get_quote = function()
    vim.notify(vim.cmd(":silent! !/home/mediocre/.config/nvim/scripts/quote.sh"))
end

M.display_quote = get_quote()

return M

