return {
  "neovim/nvim-lspconfig",
  init = function()
    local keys = require("lazyvim.plugins.lsp.keymaps").get()
    -- Existing keymaps
    keys[#keys + 1] = { "gd", vim.lsp.buf.definition, desc = "Goto Definition" }
    keys[#keys + 1] = { "gr", vim.lsp.buf.references, desc = "References" }
    keys[#keys + 1] = { "gD", vim.lsp.buf.declaration, desc = "Goto Declaration" }
    keys[#keys + 1] = { "gI", vim.lsp.buf.implementation, desc = "Goto Implementation" }
    keys[#keys + 1] = { "gy", vim.lsp.buf.type_definition, desc = "Goto T[y]pe Definition" }
    keys[#keys + 1] = { "K", vim.lsp.buf.hover, desc = "Hover" }
    keys[#keys + 1] = { "gK", vim.lsp.buf.signature_help, desc = "Signature Help" }
    keys[#keys + 1] = { "<c-k>", vim.lsp.buf.signature_help, mode = "i", desc = "Signature Help" }
    keys[#keys + 1] = { "<leader>ca", vim.lsp.buf.code_action, desc = "Code Action" }
    keys[#keys + 1] = {
      "<leader>cA",
      function()
        vim.lsp.buf.code_action({ context = { only = { "source" }, diagnostics = {} } })
      end,
      desc = "Source Action",
    }
    keys[#keys + 1] = { "<leader>f", vim.lsp.buf.format, desc = "Format" }
    keys[#keys + 1] = { "<leader>rn", vim.lsp.buf.rename, desc = "Rename" }

    -- New keymaps for next and previous diagnostic
    keys[#keys + 1] = { "<leader>gk", vim.diagnostic.goto_prev, desc = "Previous Diagnostic" }
    keys[#keys + 1] = { "<leader>gj", vim.diagnostic.goto_next, desc = "Next Diagnostic" }
  end,
  opts = {
    servers = {
      -- Servers with default setup
      flow = {},
      eslint = {},
      rust_analyzer = {},
      clangd = {},
      clojure_lsp = {},
      tailwindcss = {},
      cssls = {},
      gopls = {},

      -- Servers with custom setup
      tsserver = {
        filetypes = { "typescript", "typescriptreact", "typescript.tsx" },
        cmd = { "typescript-language-server", "--stdio" },
      },
      lua_ls = {
        settings = {
          Lua = {
            diagnostics = {
              globals = { "vim" },
            },
            workspace = {
              library = vim.api.nvim_get_runtime_file("", true),
              checkThirdParty = false,
            },
          },
        },
      },
    },
    setup = {
      -- Global setup function
      function(server, opts)
        local capabilities = require("cmp_nvim_lsp").default_capabilities()
        opts.capabilities = capabilities
        require("lspconfig")[server].setup(opts)
      end,
      -- Server-specific setup functions
      ["lua_ls"] = function(_, opts)
        require("lspconfig").lua_ls.setup(vim.tbl_deep_extend("force", opts, {
          on_attach = function(client, bufnr)
            -- Your existing on_attach function
            -- ...
            -- enable_format_on_save(client, bufnr)
          end,
        }))
      end,
    },
  },
}
