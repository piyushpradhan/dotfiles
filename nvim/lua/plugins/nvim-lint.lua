return {
  "mfussenegger/nvim-lint",
  event = { "BufReadPost", "BufNewFile" },
  config = function()
    local lint = require("lint")

    lint.linters_by_ft = {
      -- TypeScript / JavaScript
      javascript = { "eslint_d" },
      javascriptreact = { "eslint_d" },
      typescript = { "eslint_d" },
      typescriptreact = { "eslint_d" },
      -- Rust (rust_analyzer handles most; clippy optional)
      -- C/C++ (clangd handles diagnostics)
      -- Python
      python = { "ruff" },
      -- Bash / shell
      sh = { "shellcheck" },
      bash = { "shellcheck" },
      zsh = { "shellcheck" },
      -- Markdown
      markdown = { "markdownlint-cli2" },
      markdown_inline = { "markdownlint-cli2" },
    }

    vim.api.nvim_create_autocmd({ "BufWritePost" }, {
      callback = function()
        lint.try_lint()
      end,
    })
  end,
}
