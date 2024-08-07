local status, telescope = pcall(require, "telescope")
if (not status) then return end
local actions = require('telescope.actions')
local fb_actions = require('telescope').extensions.file_browser.actions

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
  extensions = {
    file_browser = {
      theme = "dropdown",
      -- disables netrw and use telescope-file-browser in its place
      hijack_netrw = true,
      mappings = {
        -- your custom insert mode mappings
        ["i"] = {
          ["<C-w>"] = function() vim.cmd('normal vbd') end,
        },
        ["n"] = {
          -- your custom normal mode mappings
          ["<S-p>"] = require("telescope.actions.layout").toggle_preview,
          ["R"] = fb_actions.rename,
          ["D"] = fb_actions.remove,
          ["y"] = fb_actions.copy,
          ["x"] = fb_actions.move,
          ["N"] = fb_actions.create,
          ["-"] = fb_actions.goto_parent_dir,
          ["/"] = function()
            vim.cmd('startinsert')
          end
        },
      },
    },
  }
}

telescope.load_extension("file_browser")
