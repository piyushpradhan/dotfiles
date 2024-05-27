local status, telescope = pcall(require, "telescope")
if (not status) then return end
local builtin = require("telescope.builtin");

local function telescope_buffer_dir()
  return vim.fn.expand('%:p:h')
end

vim.keymap.set('n', '<leader>/', function()
  -- You can pass additional configuration to telescope to change theme, layout, etc.
  require('telescope.builtin').current_buffer_fuzzy_find(require('telescope.themes').get_dropdown {
    winblend = 10,
    previewer = false,
  })
end, { desc = '[/] Fuzzily search in current buffer]' })

vim.keymap.set('n', '<leader>pf',
  function()
    builtin.find_files({
      no_ignore = false,
      hidden = true
    })
  end)
vim.keymap.set('n', '<leader>pw', function()
  builtin.live_grep({
    prompt_position = "bottom",
    preview_width = 0.8,
    results_width = 0.2,
    layout_config = { height = 80 }
  })
end)
vim.keymap.set('n', '\\\\', function()
  builtin.buffers()
end)
vim.keymap.set('n', '<leader>ph', function()
  builtin.help_tags()
end)
vim.keymap.set('n', '<leader>pr', function()
  builtin.resume()
end)
vim.keymap.set('n', '<leader>pd', function()
  builtin.diagnostics()
end)
vim.keymap.set('n', '<leader>pu', '<cmd>Telescope undo<cr>')
vim.keymap.set("n", "<leader>pv", function()
  telescope.extensions.file_browser.file_browser({
    path = "%:p:h",
    cwd = telescope_buffer_dir(),
    respect_gitignore = false,
    hidden = true,
    grouped = true,
    previewer = false,
    initial_mode = "normal",
    layout_config = { height = 40 }
  })
end)
