local status, telescope = pcall(require, "telescope")
if (not status) then return end
local actions = require('telescope.actions')

telescope.setup {
  defaults = {
    file_ignore_patterns = {
      "node_modules"
    },
    pickers = {
      find_files = {
        theme = "cursor",
      },
      live_grep = {
      }
    },
    mappings = {
      n = {
        ["q"] = actions.close
      },
    },
  },
}
