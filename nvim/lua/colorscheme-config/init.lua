vim.g.mediocre_colorscheme = "tokyonight"

function CustomColorscheme()
    vim.g.gruvbox_contrast_dark = 'hard'
    vim.g.tokyonight_transparent_sidebar = true
    vim.g.tokyonight_transparent = true
    vim.g.gruvbox_invert_selection = '0'
    vim.opt.background = "dark"

    vim.cmd("colorscheme " .. vim.g.mediocre_colorscheme)

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
