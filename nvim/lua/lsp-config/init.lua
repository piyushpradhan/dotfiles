local lspconfig = require 'lspconfig'
local nnoremap = function(key, op)
    vim.keymap.set('n', key, op, { noremap = true })
end

local lspkind = require 'lspkind'
require('lspkind').init({
    mode = 'symbol_text',
    preset = 'codicons',
    symbol_map = {
        Text = "",
        Method = "",
        Function = "",
        Constructor = "",
        Field = "ﰠ",
        Variable = "",
        Class = "ﴯ",
        Interface = "",
        Module = "",
        Property = "ﰠ",
        Unit = "塞",
        Value = "",
        Enum = "",
        Keyword = "",
        Snippet = "",
        Color = "",
        File = "",
        Reference = "",
        Folder = "",
        EnumMember = "",
        Constant = "",
        Struct = "פּ",
        Event = "",
        Operator = "",
        TypeParameter = ""
    },
})

local cmp = require 'cmp'
cmp.setup({
    snippet = {
        -- REQUIRED - you must specify a snippet engine
        expand = function(args)
            vim.fn["vsnip#anonymous"](args.body) -- For `vsnip` users.
            -- require('luasnip').lsp_expand(args.body) -- For `luasnip` users.
            -- require('snippy').expand_snippet(args.body) -- For `snippy` users.
            -- vim.fn["UltiSnips#Anon"](args.body) -- For `ultisnips` users.
        end,
    },
    window = {
        -- completion = cmp.config.window.bordered(),
        -- documentation = cmp.config.window.bordered(),
    },

    formatting = {
        format = lspkind.cmp_format({
            mode = 'symbol',
            maxwidth = 50,

            before = function(entry, vim_item)
                vim_item.menu = ({
                    nvim_lsp = "[LSP]",
                    look = "[Dict]",
                    buffer = "[Buffer]",
                })[entry.source.name]
                return vim_item
            end
        })
    },

    mapping = cmp.mapping.preset.insert({
        ['<C-b>'] = cmp.mapping.scroll_docs(-4),
        ['<C-f>'] = cmp.mapping.scroll_docs(4),
        -- ['<leader>a'] = cmp.mapping.complete(),
        ['<C-e>'] = cmp.mapping.abort(),
        ['<CR>'] = cmp.mapping.confirm({ select = true }), -- Accept currently selected item. Set `select` to `false` to only confirm explicitly selected items.
        ['<Tab>'] = cmp.mapping.select_next_item(),
        ['<S-Tab>'] = cmp.mapping.select_prev_item(),
    }),
    sources = cmp.config.sources({
        { name = 'treesitter' },
        { name = 'nvim_lsp' },
        { name = 'vsnip' }, -- For vsnip users.
        -- { name = 'luasnip' }, -- For luasnip users.
        -- { name = 'ultisnips' }, -- For ultisnips users.
        -- { name = 'snippy' }, -- For snippy users.
    }, {
        { name = 'buffer' },
    })
})

-- Set configuration for specific filetype.
cmp.setup.filetype('gitcommit', {
    sources = cmp.config.sources({
        { name = 'cmp_git' }, -- You can specify the `cmp_git` source if you were installed it.
    }, {
        { name = 'buffer' },
    })
})

-- Use buffer source for `/` (if you enabled `native_menu`, this won't work anymore).
cmp.setup.cmdline('/', {
    mapping = cmp.mapping.preset.cmdline(),
    sources = {
        { name = 'buffer' }
    }
})

-- Use cmdline & path source for ':' (if you enabled `native_menu`, this won't work anymore).
cmp.setup.cmdline(':', {
    mapping = cmp.mapping.preset.cmdline(),
    sources = cmp.config.sources({
        { name = 'path' }
    }, {
        { name = 'cmdline' }
    })
})

-- Setup lspconfig.
local capabilities = require('cmp_nvim_lsp').update_capabilities(vim.lsp.protocol.make_client_capabilities())

-- autoformatting
vim.cmd [[autocmd BufWritePre *.js lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.cpp lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.c lua vim.lsp.buf.formatting_sync()]]
vim.cmd [[autocmd BufWritePre *.dart lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.jsx lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.md lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.py lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.yaml lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.toml lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.h lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.lua lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.vim lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.css lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.go lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.php lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.xml lua vim.lsp.buf.formatting_sync(nil, 100)]]
vim.cmd [[autocmd BufWritePre *.json lua vim.lsp.buf.formatting_sync(nil, 100)]]


local on_attach = function(client, bufnr)
    -- Enable completion triggered by <c-x><c-o>
    vim.api.nvim_buf_set_option(bufnr, 'omnifunc', 'v:lua.vim.lsp.omnifunc')

    -- Mappings.
    -- See `:help vim.lsp.*` for documentation on any of the below functions
    local bufopts = { noremap = true, silent = true, buffer = bufnr }
    vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, bufopts)
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
    vim.keymap.set('n', 'ga', vim.lsp.buf.code_action, bufopts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, bufopts)
    vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, bufopts)
    vim.keymap.set('n', '<C-k>', vim.lsp.buf.signature_help, bufopts)
    vim.keymap.set('n', ',wa', vim.lsp.buf.add_workspace_folder, bufopts)
    vim.keymap.set('n', ',wr', vim.lsp.buf.remove_workspace_folder, bufopts)
    vim.keymap.set('n', ',wl', function()
        print(vim.inspect(vim.lsp.buf.list_workspace_folders()))
    end, bufopts)
    vim.keymap.set('n', ',D', vim.lsp.buf.type_definition, bufopts)
    vim.keymap.set('n', ',rn', vim.lsp.buf.rename, bufopts)
    vim.keymap.set('n', ',ca', vim.lsp.buf.code_action, bufopts)
    vim.keymap.set('n', 'gr', vim.lsp.buf.references, bufopts)
    vim.keymap.set('n', ',f', vim.lsp.buf.formatting, bufopts)
end

-- setting up language servers

lspconfig.pyright.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.awk_ls.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.bashls.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.clangd.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.dockerls.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.eslint.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.gopls.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.html.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.jdtls.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.jsonls.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.kotlin_language_server.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.lemminx.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.marksman.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.tsserver.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.sumneko_lua.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.omnisharp.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
lspconfig.dartls.setup {
    on_attach = on_attach,
    capabilities = capabilities
}
