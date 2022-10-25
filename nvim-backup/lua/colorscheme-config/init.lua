local neoSol = require('colorscheme-config.neosolarized')
-- vim.g.mediocre_colorscheme = "tokyonight"
vim.g.mediocre_wal = "wal"
vim.g.mediocre_gruvbox = "gruvbox"
vim.g.mediocre_tokyonight = "tokyonight"
vim.g.mediocre_oxocarbon = "oxocarbon-lua"
vim.g.mediocre_hackthebox = "hackthebox"
vim.g.mediocre_solarized = "NeoSolarized"

function CustomColorscheme()
	vim.g.gruvbox_contrast_dark = 'hard'
	vim.g.gruvbox_transparent = true
	vim.g.gruvbox_transparent_sidebar = true
	vim.g.tokyonight_transparent_sidebar = true
	vim.g.tokyonight_transparent = true
	vim.g.gruvbox_invert_selection = '0'
	vim.g.neosolarized_contrast = "normal"
	vim.g.neosolarized_vertSplitBgTrans = 1
	vim.g.neosolarized_bold = 1
	vim.g.neosolarized_underline = 1
	vim.g.neosolarized_italic = 1
	vim.g.neosolarized_termBoldAsBright = 1
	vim.opt.background = "dark"

	-- vim.cmd("colorscheme " .. vim.g.mediocre_wal)
	-- vim.cmd("colorscheme " .. vim.g.mediocre_gruvbox)
	-- vim.cmd("colorscheme " .. vim.g.mediocre_tokyonight)
	vim.cmd("colorscheme " .. vim.g.mediocre_tokyonight)
	-- vim.cmd("colorscheme " .. vim.g.mediocre_hackthebox)

	local h1 = function(thing, opts)
		vim.api.nvim_set_hl(0, thing, opts)
	end

	h1("SignColumn", {
		bg = "none",
	})

	h1("ColorColumn", {
		ctermbg = 0,
		bg = "#555555",
	})

	h1("CursorLineNR", {
		bg = "none",
	})

	h1("Normal", {
		bg = "none",
	})

	h1("LineNr", {
		fg = "#5eacd3",
	})
end

CustomColorscheme()
-- vim.cmd("colorscheme tokyonight")
