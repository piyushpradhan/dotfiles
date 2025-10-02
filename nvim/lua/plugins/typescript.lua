return {
  -- TypeScript-specific plugins and configurations
  {
    "pmizio/typescript-tools.nvim",
    dependencies = { "nvim-lua/plenary.nvim", "neovim/nvim-lspconfig" },
    opts = {
      on_attach = function(client, bufnr)
        -- Use the same on_attach function from lsp.lua
        local function buf_set_keymap(...)
          vim.api.nvim_buf_set_keymap(bufnr, ...)
        end
        local opts = { noremap = true, silent = true }
        
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
      end,
      settings = {
        tsserver_file_preferences = {
          includeInlayParameterNameHints = "all",
          includeInlayParameterNameHintsWhenArgumentMatchesName = false,
          includeInlayFunctionParameterTypeHints = true,
          includeInlayVariableTypeHints = true,
          includeInlayPropertyDeclarationTypeHints = true,
          includeInlayFunctionLikeReturnTypeHints = true,
          includeInlayEnumMemberValueHints = true,
        },
        tsserver_plugins = {
          "@typescript-eslint/tslint-plugin",
        },
      },
    },
  },

  -- Auto-completion for TypeScript
  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      "hrsh7th/cmp-nvim-lsp",
      "hrsh7th/cmp-buffer",
      "hrsh7th/cmp-path",
      "hrsh7th/cmp-cmdline",
      "saadparwaiz1/cmp_luasnip",
      "L3MON4D3/LuaSnip",
      "rafamadriz/friendly-snippets",
    },
    config = function()
      local cmp = require("cmp")
      local luasnip = require("luasnip")

      -- Load snippets
      require("luasnip.loaders.from_vscode").lazy_load()

      cmp.setup({
        snippet = {
          expand = function(args)
            luasnip.lsp_expand(args.body)
          end,
        },
        mapping = cmp.mapping.preset.insert({
          ["<C-b>"] = cmp.mapping.scroll_docs(-4),
          ["<C-f>"] = cmp.mapping.scroll_docs(4),
          ["<C-Space>"] = cmp.mapping.complete(),
          ["<CR>"] = cmp.mapping.confirm({
            behavior = cmp.ConfirmBehavior.Replace,
            select = true,
          }),
          ["<Tab>"] = cmp.mapping(function(fallback)
            if cmp.visible() then
              cmp.select_next_item()
            elseif luasnip.expand_or_jumpable() then
              luasnip.expand_or_jump()
            else
              fallback()
            end
          end, { "i", "s" }),
          ["<S-Tab>"] = cmp.mapping(function(fallback)
            if cmp.visible() then
              cmp.select_prev_item()
            elseif luasnip.jumpable(-1) then
              luasnip.jump(-1)
            else
              fallback()
            end
          end, { "i", "s" }),
        }),
        sources = {
          { name = "nvim_lsp" },
          { name = "luasnip" },
          { name = "buffer" },
          { name = "path" },
        },
      })
    end,
  },

  -- TypeScript-specific keybindings
  {
    "nvim-treesitter/nvim-treesitter",
    opts = {
      highlight = {
        enable = true,
        additional_vim_regex_highlighting = false,
      },
      indent = {
        enable = true,
      },
      autotag = {
        enable = true,
      },
    },
  },
}