return {
  "stevearc/conform.nvim",
  event = { "BufWritePre" },
  cmd = { "ConformInfo" },
  keys = {
    { "<leader>cf", function() require("conform").format({ async = true }) end, mode = { "n", "v" }, desc = "Format" },
  },
  opts = {
    format_on_save = {
      timeout_ms = 500,
      lsp_fallback = true,
    },
    formatters_by_ft = {
      -- TypeScript / JavaScript
      javascript = { "prettier" },
      javascriptreact = { "prettier" },
      typescript = { "prettier" },
      typescriptreact = { "prettier" },
      json = { "prettier" },
      jsonc = { "prettier" },
      -- Rust
      rust = { "rustfmt" },
      -- C/C++
      c = { "clang_format" },
      cpp = { "clang_format" },
      -- Python
      python = { "black" },
      -- Bash / shell
      sh = { "shfmt" },
      bash = { "shfmt" },
      zsh = { "shfmt" },
      -- Markdown
      markdown = { "prettier" },
      markdown_inline = { "prettier" },
    },
    formatters = {
      shfmt = {
        prepend_args = { "-i", "2" },
      },
    },
  },
}
