local prettier = require("prettier")
prettier.format();

prettier.setup({
  bin = 'prettier',
  filetypes = {
    "css",
    "html",
    "javascript",
    "javascriptreact",
    "json",
    "markdown"
  },
  ["null-ls"] = {
    condition = function()
      return prettier.config_exists({
        check_package_json = true,
      })
    end,
    runtime_condition = function(params)
      return true
    end,
    timeout = 5000
  }
})
