vim.opt.background = "dark" -- The theme has `dark` and `light` styles

require("monokai-nightasty").setup({
  dark_style_background = "transparent", -- default, dark, transparent, #color
  light_style_background = "default",    -- default, dark, transparent, #color
  terminal_colors = true,                -- Set the colors used when opening a `:terminal`
  color_headers = true,                  -- Enable header colors for each header level (h1, h2, etc.)
  hl_styles = {
    -- Style to be applied to different syntax groups. See `:help nvim_set_hl`
    comments = { italic = true },
    keywords = { italic = false },
    functions = {},
    variables = {},
    -- Background styles for sidebars (panels) and floating windows:
    floats = "dark",          -- default, dark, transparent
    sidebars = "transparent", -- default, dark, transparent
  },
  -- sidebars = { "qf", "help" },      -- Set a darker background on sidebar-like windows. For example: `["qf", "vista_kind", "terminal", "packer"]`

  hide_inactive_statusline = false, -- Hide inactive statuslines and replace them with a thin border instead. Should work with the standard **StatusLine** and **LuaLine**.
  dim_inactive = false,             -- dims inactive windows
  lualine_bold = true,              -- Lualine headers will be bold or regular.
  lualine_style = "default",        -- "dark", "light" or "default" (Follows dark/light style)

  --- You can override specific color/highlights. Current values in `extras/palettes`

  ---@param colors ColorScheme
  on_colors = function(colors)
    colors.border = colors.grey
    colors.comment = "#2d7e79"
  end,

  ---@param highlights Highlights
  ---@param colors ColorScheme
  on_highlights = function(highlights, colors)
    highlights.TelescopeNormal = { fg = colors.blue, bg = colors.charcoal }
    highlights.WinSeparator = { fg = colors.grey }
  end,
})

-- Toggle Dark/Light styles
vim.keymap.set(
  { "n", "v" }, "<leader>tl", "<CMD>MonokaiToggleLight<CR>",
  { silent = true, desc = "Monokai-NighTasty: Toggle light/dark theme" }
)
vim.api.nvim_set_hl(0, "Normal", { bg = "none" })
vim.api.nvim_set_hl(0, "NormalFloat", { bg = "none" })
vim.api.nvim_set_hl(0, "NormalNC", { bg = "none" })
vim.api.nvim_set_hl(0, "NormalSB", { bg = "none" })
