return {
  "neovim/nvim-lspconfig",
  event = { "BufReadPre", "BufNewFile" },
  dependencies = {
    { "folke/lazydev.nvim", opts = {} },
  },
  config = function()
    local status, nvim_lsp = pcall(require, "lspconfig")
    if not status then
      return
    end

    local protocol = require("vim.lsp.protocol")

    local augroup_format = vim.api.nvim_create_augroup("Format", { clear = true })
    local enable_format_on_save = function(_, bufnr)
      vim.api.nvim_clear_autocmds({ group = augroup_format, buffer = bufnr })
      vim.api.nvim_create_autocmd("BufWritePre", {
        group = augroup_format,
        buffer = bufnr,
        callback = function()
          vim.lsp.buf.format({ bufnr = bufnr })
        end,
      })
    end

    -- Use an on_attach function to only map the following keys
    -- after the language server attaches to the current buffer
    local on_attach = function(client, bufnr)
      local function buf_set_keymap(...)
        vim.api.nvim_buf_set_keymap(bufnr, ...)
      end

      --Enable completion triggered by <c-x><c-o>
      --local function buf_set_option(...) vim.api.nvim_buf_set_option(bufnr, ...) end
      --buf_set_option('omnifunc', 'v:lua.vim.lsp.omnifunc')

      -- Mappings.
      local opts = { noremap = true, silent = true }

      -- See `:help vim.lsp.*` for documentation on any of the below functions
      buf_set_keymap("n", "gD", "<cmd>lua vim.lsp.buf.declaration()<CR>", opts)
      buf_set_keymap("n", "gd", "<cmd>Telescope lsp_definitions<CR>", opts)
      buf_set_keymap("n", "gi", "<cmd>lua vim.lsp.buf.implementation()<CR>", opts)
      buf_set_keymap("n", "gr", "<cmd>Telescope lsp_references<CR>", opts)
      buf_set_keymap("n", "K", "<cmd>lua vim.lsp.buf.hover()<CR>", opts)
      buf_set_keymap("n", "<leader>gf", "<cmd>lua vim.lsp.buf.format()<CR>", opts)
      buf_set_keymap("n", "<leader>ca", "<cmd>lua vim.lsp.buf.code_action()<CR>", opts)
      buf_set_keymap("n", "<leader>cd", "<cmd>Telescope diagnostics<CR>", opts)
      buf_set_keymap("n", "<leader>gw", "<cmd>Telescope lsp_workspace_diagnostics<CR>", opts)
      buf_set_keymap("n", "<leader>gs", "<cmd>Telescope lsp_document_symbols<CR>", opts)
      buf_set_keymap("n", "<leader>gS", "<cmd>Telescope lsp_workspace_symbols<CR>", opts)
      buf_set_keymap("n", "<leader>gr", "<cmd>lua vim.lsp.buf.incoming_calls()<CR>", opts)
      buf_set_keymap("n", "<leader>go", "<cmd>lua vim.lsp.buf.outgoing_calls()<CR>", opts)
      buf_set_keymap("n", "<leader>gt", "<cmd>lua vim.lsp.buf.type_definition()<CR>", opts)
      buf_set_keymap("n", "<leader>gj", "<cmd>lua vim.diagnostic.goto_next()<CR>", opts)
      buf_set_keymap("n", "<leader>gk", "<cmd>lua vim.diagnostic.goto_prev()<CR>", opts)
    end

    protocol.CompletionItemKind = {
      Text = "󰉿",
      Method = "󰆧",
      Function = "󰊕",
      Constructor = "",
      Field = "󰜢",
      Variable = "󰀫",
      Class = "󰠱",
      Interface = "",
      Module = "",
      Property = "󰜢",
      Unit = "󰑭",
      Value = "󰎠",
      Enum = "",
      Keyword = "󰌋",
      Snippet = "",
      Color = "󰏘",
      File = "󰈙",
      Reference = "󰈇",
      Folder = "󰉋",
      EnumMember = "",
      Constant = "󰏿",
      Struct = "󰙅",
      Event = "",
      Operator = "󰆕",
      TypeParameter = "",
    }

    -- Set up completion using nvim_cmp with LSP source

    nvim_lsp.flow.setup({
      on_attach = on_attach,
    })

    nvim_lsp.eslint.setup({
      on_attach = on_attach,
    })

    nvim_lsp.rust_analyzer.setup({
      on_attach = on_attach,
    })

    nvim_lsp.cmake.setup({
      on_attach = on_attach,
    })

    nvim_lsp.clangd.setup({
      on_attach = on_attach,
    })

    nvim_lsp.clojure_lsp.setup({
      on_attach = on_attach,
    })

    nvim_lsp.ts_ls.setup({
      on_attach = function(client, bufnr)
        on_attach(client, bufnr)
        enable_format_on_save(client, bufnr)
      end,
      filetypes = {
        "typescript",
        "typescriptreact",
        "typescript.tsx",
        "javascript",
        "javascriptreact",
        "javascript.jsx",
      },
      cmd = { "typescript-language-server", "--stdio" },
      settings = {
        typescript = {
          inlayHints = {
            includeInlayParameterNameHints = "all",
            includeInlayParameterNameHintsWhenArgumentMatchesName = false,
            includeInlayFunctionParameterTypeHints = true,
            includeInlayVariableTypeHints = true,
            includeInlayPropertyDeclarationTypeHints = true,
            includeInlayFunctionLikeReturnTypeHints = true,
            includeInlayEnumMemberValueHints = true,
          },
        },
        javascript = {
          inlayHints = {
            includeInlayParameterNameHints = "all",
            includeInlayParameterNameHintsWhenArgumentMatchesName = false,
            includeInlayFunctionParameterTypeHints = true,
            includeInlayVariableTypeHints = true,
            includeInlayPropertyDeclarationTypeHints = true,
            includeInlayFunctionLikeReturnTypeHints = true,
            includeInlayEnumMemberValueHints = true,
          },
        },
      },
    })

    nvim_lsp.lua_ls.setup({

      on_attach = function(client, bufnr)
        on_attach(client, bufnr)
        enable_format_on_save(client, bufnr)
      end,
      settings = {
        Lua = {
          diagnostics = {
            -- Get the language server to recognize the `vim` global
            globals = { "vim" },
          },

          workspace = {
            -- Make the server aware of Neovim runtime files
            library = vim.api.nvim_get_runtime_file("", true),
            checkThirdParty = false,
          },
        },
      },
    })

    nvim_lsp.tailwindcss.setup({
      on_attach = on_attach,
    })

    nvim_lsp.cssls.setup({
      on_attach = on_attach,
    })

    vim.lsp.handlers["textDocument/publishDiagnostics"] = vim.lsp.with(vim.lsp.diagnostic.on_publish_diagnostics, {
      underline = true,
      update_in_insert = false,
      virtual_text = { spacing = 4, prefix = "●" },
      severity_sort = true,
    })

    -- Diagnostic symbols in the sign column (gutter)
    local signs = { Error = " ", Warn = " ", Hint = " ", Info = " " }
    for type, icon in pairs(signs) do
      local hl = "DiagnosticSign" .. type
      vim.fn.sign_define(hl, { text = icon, texthl = hl, numhl = "" })
    end

    vim.diagnostic.config({
      virtual_text = {
        prefix = "●",
      },
      update_in_insert = true,
      float = {
        source = "always", -- Or "if_many"
      },
    })
  end,
}
