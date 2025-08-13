return {
  "nvim-telescope/telescope.nvim",
  tag = "0.1.8",
  dependencies = {
    "nvim-lua/plenary.nvim",
    "nvim-telescope/telescope-file-browser.nvim",
    "debugloop/telescope-undo.nvim",
  },
  config = function()
    local telescope = require("telescope")
    local actions = require("telescope.actions")
    local builtin = require("telescope.builtin")
    local fb_actions = telescope.extensions.file_browser.actions

    local function telescope_buffer_dir()
      return vim.fn.expand("%:p:h")
    end

    require("telescope").setup({
      defaults = {
        wrap_results = true,
        layout_strategy = "horizontal",
        layout_config = { prompt_position = "top" },
        sorting_strategy = "ascending",
        winblend = 0,
        file_ignore_patterns = {
          "node_modules",
        },
        mappings = {
          n = {
            ["q"] = actions.close,
          },
        },
      },

      extensions = {
        undo = {
          mappings = {
            i = {
              ["<cr>"] = require("telescope-undo.actions").yank_additions,
              ["<S-cr>"] = require("telescope-undo.actions").yank_deletions,
              ["<C-cr>"] = require("telescope-undo.actions").restore,
              ["<C-y>"] = require("telescope-undo.actions").yank_deletions,
              ["<C-r>"] = require("telescope-undo.actions").restore,
            },
            n = {
              ["y"] = require("telescope-undo.actions").yank_additions,
              ["Y"] = require("telescope-undo.actions").yank_deletions,
              ["u"] = require("telescope-undo.actions").restore,
            },
          },
        },
        file_browser = {
          theme = "dropdown",
          -- disables netrw and use telescope-file-browser in its place
          hijack_netrw = true,
          mappings = {
            -- your custom insert mode mappings
            ["i"] = {
              ["<C-w>"] = function()
                vim.cmd("normal vbd")
              end,
            },
            ["n"] = {
              -- your custom normal mode mappings
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

    telescope.load_extension("undo")
    telescope.load_extension("file_browser")

    vim.keymap.set("n", "<leader>/", function()
      -- You can pass additional configuration to telescope to change theme, layout, etc.
      require("telescope.builtin").current_buffer_fuzzy_find(require("telescope.themes").get_dropdown({
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
    vim.keymap.set("n", "<leader>pu", "<cmd>Telescope undo<cr>")
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
    vim.keymap.set("n", "<leader>pd", "<cmd>Telescope diagnostics<cr>")
    vim.keymap.set("n", "<leader>pt", "<cmd>Telescope treesitter<cr>")
    
    -- LSP Telescope mappings
    vim.keymap.set("n", "<leader>ld", "<cmd>Telescope lsp_definitions<cr>", { desc = "LSP Definitions" })
    vim.keymap.set("n", "<leader>li", "<cmd>Telescope lsp_implementations<cr>", { desc = "LSP Implementations" })
    vim.keymap.set("n", "<leader>lr", "<cmd>Telescope lsp_references<cr>", { desc = "LSP References" })
    vim.keymap.set("n", "<leader>ls", "<cmd>Telescope lsp_document_symbols<cr>", { desc = "LSP Document Symbols" })
    vim.keymap.set("n", "<leader>lS", "<cmd>Telescope lsp_workspace_symbols<cr>", { desc = "LSP Workspace Symbols" })
    vim.keymap.set("n", "<leader>la", "<cmd>Telescope lsp_code_actions<cr>", { desc = "LSP Code Actions" })
    vim.keymap.set("n", "<leader>lt", "<cmd>Telescope lsp_type_definitions<cr>", { desc = "LSP Type Definitions" })
    vim.keymap.set("n", "<leader>lc", "<cmd>Telescope lsp_incoming_calls<cr>", { desc = "LSP Incoming Calls" })
    vim.keymap.set("n", "<leader>lo", "<cmd>Telescope lsp_outgoing_calls<cr>", { desc = "LSP Outgoing Calls" })
  end,
}
