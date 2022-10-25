local actions = require('telescope.actions')
local keymapper = vim.keymap.set
local key_mapping = function(mode, key, op, opts)
	keymapper(mode, key, op, { noremap = true, silent = true })
end

require('telescope').setup {
	defaults = {
		file_ignore_patterns = {
			"node_modules",
		},
		extensions = {
			["ui-select"] = {
				require('telescope.themes').get_dropdown {

				}
			}
		},
		-- Default configuration for telescope goes here:
		-- config_key = value,
		mappings = {
			i = {
				["<C-c>"] = actions.close
			},
			n = {
				["<C-c>"] = actions.close
			}
		}
	},
}

require('telescope').load_extension('ui-select')

key_mapping("n", "<leader>e", ":lua require('telescope.builtin').find_files()<CR>")
key_mapping("n", "<leader>f", ":lua require('telescope.builtin').live_grep()<CR>")
key_mapping("n", "\\", ":lua require('telescope.builtin').buffers()<CR>")
-- key_mapping("n", "h;", ":lua require('telescope.builtin').help_tags()<CR>")

key_mapping("n", "<leader>b", ":lua require('telescope-config.background-selector').wallpaper_selector()<CR>")

key_mapping("v", "<leader>gr", ":<C-w>Telescope lsp_references<CR>")