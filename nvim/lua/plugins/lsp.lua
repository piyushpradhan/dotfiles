return {
  "neovim/nvim-lspconfig",
  dependencies = {
    "williamboman/mason.nvim",
    "williamboman/mason-lspconfig.nvim",
    "hrsh7th/cmp-nvim-lsp",
  },
  event = { "BufReadPre", "BufNewFile" },
  config = function()
    -- LSP capabilities for nvim-cmp completion
    local caps = require("cmp_nvim_lsp").default_capabilities()
    local servers = { "ts_ls", "rust_analyzer", "clangd", "pyright", "bashls", "marksman" }
    for _, server in ipairs(servers) do
      local cfg = vim.lsp.config[server] or {}
      vim.lsp.config(server, vim.tbl_deep_extend("force", cfg, { capabilities = caps }))
    end

    require("mason").setup({
      ensure_installed = {
        -- LSP servers
        "typescript-language-server",
        "rust-analyzer",
        "clangd",
        "pyright",
        "bash-language-server",
        "marksman",
        -- Formatters & linters
        "prettier",
        "eslint_d",
        "rustfmt",
        "clang-format",
        "black",
        "shfmt",
        "shellcheck",
        "markdownlint-cli2",
        "ruff",
      },
    })
    require("mason-lspconfig").setup({
      automatic_enable = true,
    })

    -- LSP UI: diagnostic signs (Nerd Font icons; fallback to ✘⚠◆ℹ if missing)
    local signs = {
      Error = "✘",
      Warn = "⚠",
      Hint = "◆",
      Info = "ℹ",
    }
    for type, icon in pairs(signs) do
      local hl = "DiagnosticSign" .. type
      vim.fn.sign_define(hl, { text = icon, texthl = hl, numhl = hl })
    end

    -- LSP UI: diagnostic config with severity-aware virtual text
    vim.diagnostic.config({
      virtual_text = {
        spacing = 4,
        format = function(d)
          local icons = {
            [vim.diagnostic.severity.ERROR] = "✘",
            [vim.diagnostic.severity.WARN] = "⚠",
            [vim.diagnostic.severity.HINT] = "◆",
            [vim.diagnostic.severity.INFO] = "ℹ",
          }
          local icon = icons[d.severity] or "·"
          return icon .. " " .. d.message:gsub("\n", " "):sub(1, 55)
        end,
      },
      signs = true,
      underline = true,
      severity_sort = true,
      float = {
        border = "rounded",
        header = { " Diagnostic ", "NormalFloat" },
        prefix = "",
        source = "always",
        title = true,
      },
    })

    -- LSP UI: hover & signature help with borders
    local orig_hover = vim.lsp.handlers["textDocument/hover"]
    vim.lsp.handlers["textDocument/hover"] = vim.lsp.with(orig_hover, {
      border = "rounded",
      max_width = 80,
      max_height = 25,
    })

    local orig_sig = vim.lsp.handlers["textDocument/signatureHelp"]
    vim.lsp.handlers["textDocument/signatureHelp"] = vim.lsp.with(orig_sig, {
      border = "rounded",
      max_width = 80,
    })

  end,
}
