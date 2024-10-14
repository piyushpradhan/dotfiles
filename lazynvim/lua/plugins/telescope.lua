return {
  "nvim-telescope/telescope.nvim",
  dependencies = {
    "nvim-lua/plenary.nvim",
    "nvim-telescope/telescope-file-browser.nvim",
  },
  config = function()
    local telescope = require("telescope")
    local actions = require("telescope.actions")
    local builtin = require("telescope.builtin")

    local function telescope_buffer_dir()
      return vim.fn.expand("%:p:h")
    end

    local fb_actions = require("telescope").extensions.file_browser.actions

    telescope.setup({
      defaults = {
        file_ignore_patterns = {
          "node_modules",
        },
        mappings = {
          n = {
            ["q"] = actions.close,
          },
        },
      },
      pickers = {
        find_files = {
          theme = "dropdown",
          previewer = true,
          hidden = true,
          layout_strategy = "horizontal",
          layout_config = {
            width = 0.9,
            height = 0.8,
          },
        },
        live_grep = {},
      },
      extensions = {
        -- undo = {
        --   mappings = {
        --     i = {
        --       ["<cr>"] = require("telescope-undo.actions").yank_additions,
        --       ["<S-cr>"] = require("telescope-undo.actions").yank_deletions,
        --       ["<C-cr>"] = require("telescope-undo.actions").restore,
        --       ["<C-y>"] = require("telescope-undo.actions").yank_deletions,
        --       ["<C-r>"] = require("telescope-undo.actions").restore,
        --     },
        --     n = {
        --       ["y"] = require("telescope-undo.actions").yank_additions,
        --       ["Y"] = require("telescope-undo.actions").yank_deletions,
        --       ["u"] = require("telescope-undo.actions").restore,
        --     },
        --   },
        -- },
        file_browser = {
          theme = "dropdown",
          hijack_netrw = true,
          mappings = {
            ["i"] = {
              ["<C-w>"] = function()
                vim.cmd("normal vbd")
              end,
            },
            ["n"] = {
              ["R"] = fb_actions.rename,
              ["D"] = fb_actions.remove,
              ["y"] = fb_actions.copy,
              ["x"] = fb_actions.move,
              ["N"] = fb_actions.create,
              ["-"] = fb_actions.goto_parent_dir,
              ["/"] = function()
                vim.cmd("startinsert")
              end,
            },
          },
        },
      },
    })

    -- telescope.load_extension("undo")
    telescope.load_extension("file_browser")

    -- Keymaps
    vim.keymap.set("n", "<leader>/", function()
      builtin.current_buffer_fuzzy_find(require("telescope.themes").get_dropdown({
        winblend = 10,
        previewer = false,
      }))
    end, { desc = "[/] Fuzzily search in current buffer]" })

    vim.keymap.set("n", "<leader>pf", function()
      builtin.find_files({
        no_ignore = false,
        hidden = true,
      })
    end)

    vim.keymap.set("n", "<leader>pw", function()
      builtin.live_grep({
        prompt_position = "bottom",
        preview_width = 0.8,
        results_width = 0.2,
        layout_config = { height = 80 },
      })
    end)

    vim.keymap.set("n", "\\\\", function()
      builtin.buffers()
    end)

    vim.keymap.set("n", "<leader>ph", function()
      builtin.help_tags()
    end)

    vim.keymap.set("n", "<leader>pr", function()
      builtin.resume()
    end)

    vim.keymap.set("n", "<leader>pd", function()
      builtin.diagnostics()
    end)

    -- vim.keymap.set("n", "<leader>pu", "<cmd>Telescope undo<cr>")

    vim.keymap.set("n", "<leader>pv", function()
      telescope.extensions.file_browser.file_browser({
        path = "%:p:h",
        cwd = telescope_buffer_dir(),
        respect_gitignore = false,
        hidden = true,
        grouped = true,
        previewer = false,
        initial_mode = "normal",
        layout_config = { height = 40 },
      })
    end)
  end,
}
