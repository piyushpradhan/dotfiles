return {
  "mason-org/mason.nvim",
  dependencies = {
    "mason-org/mason-lspconfig.nvim",
    "WhoIsSethDaniel/mason-tool-installer.nvim",
  },
  config = function()
    require("mason").setup()

    require("mason-lspconfig").setup({
      automatic_installation = true,
      ensure_installed = {
        "cssls",
        "eslint",
        "html",
        "jsonls",
        "ts_ls",
        "pyright",
        "tailwindcss",
        "rust_analyzer",
        "lua_ls",
        "gopls",
        "clangd",
        "cmake",
        "clojure_lsp",
        "flow",
      },
    })

    require("mason-tool-installer").setup({
      ensure_installed = {
        "prettier",
        "stylua", -- lua formatter
        "eslint_d",
        "typescript-language-server",
        "biome", -- alternative to prettier/eslint
      },
    })
  end,
}
