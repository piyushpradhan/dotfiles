local lsp = require('lsp-zero')

lsp.preset("recommended")

lsp.ensure_installed({
    'tsserver',
    'eslint',
    'sumneko_lua',
    'rust_analyzer',
})

local cmp = require('cmp')
local cmp_select = { behaviour = cmp.SelectBehavior.Select }
local cmp_mappings = lsp.defaults.cmp_mappings({
    ['<S-Tab>'] = cmp.mapping.select_prev_item(cmp_select),
    ['<Tab>'] = cmp.mapping.select_next_item(cmp_select),
    ['<CR>'] = cmp.mapping.confirm({ select = true }),
    ['<C-Space>'] = cmp.mapping.complete(),
})

lsp.set_preferences({
    sign_icons = {
        error = '✘',
        warn = '▲',
        hint = '⚑',
        info = ''
    },
})

lsp.setup_nvim_cmp({
    mapping = cmp_mappings
})

lsp.on_attach(function(client, bufnr)
    local opts = { buffer = bufnr, remap = false }

    vim.keymap.set("n", "gd", function() vim.lsp.buf.definition() end, opts)
    vim.keymap.set("n", "K", function() vim.lsp.buf.hover() end, opts)
    vim.keymap.set("n", "<leader>ws", function() vim.lsp.buf.workspace_symbol() end, opts)
    vim.keymap.set("n", "<leader>of", function() vim.diagnostic.open_float() end, opts)
    vim.keymap.set("n", "<C-j>", function() vim.diagnostic.goto_next() end, opts)
    vim.keymap.set("n", "<C-k>", function() vim.diagnostic.goto_prev() end, opts)
    vim.keymap.set("n", "<leader>ga", function() vim.lsp.buf.code_action() end, opts)
    vim.keymap.set("n", "<leader>gr", function() vim.lsp.buf.references() end, opts)
    vim.keymap.set("n", "<leader>gR", function() vim.lsp.buf.rename() end, opts)
    vim.keymap.set("i", "<C-h", function() vim.lsp.buf.signature_help() end, opts)
    -- vim.keymap.set("n", "<leader>ff", function() vim.lsp.buf.format() end, opts)
end)

lsp.setup()
