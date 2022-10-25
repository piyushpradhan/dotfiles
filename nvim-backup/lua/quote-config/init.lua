local keymapper = function(key, op)
    vim.keymap.set('n', key, op, { noremap = true })
end

keymapper('<C-S-a>', ':lua require("quote-config.animequote").display_quote()<CR>')
