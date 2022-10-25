function ContextSetup(show_all_context)
    require("treesitter-context").setup({
        enable = true,
        throttle = true, -- Throttles plugin updates
        max_lines = 0, -- How many lines the window should span
        show_all_context = show_all_context,
        patterns = {
            default = {
                "function",
                "method",
                "for",
                "while",
                "if",
                "switch",
                "case",
            },
        }
    })
end

vim.keymap.set('n', '<leader>cf', function() ContextSetup(true) end, { noremap = true })
vim.keymap.set('n', '<leader>cp', function() ContextSetup(false) end, { noremap = true })
ContextSetup(false)
