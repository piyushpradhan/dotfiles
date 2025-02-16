return {
  {
    "slugbyte/lackluster.nvim",
    lazy = false,
    priority = 1000,
    init = function()
      -- vim.cmd.colorscheme("lackluster")
      -- vim.cmd.colorscheme("lackluster-hack") -- my favorite
      -- vim.cmd.colorscheme("lackluster-mint")
    end,
  },
  { "aliqyan-21/darkvoid.nvim" },
  { "Mofiqul/vscode.nvim" },
  {
    "dasupradyumna/midnight.nvim",
    lazy = false,
    priority = 1000,
    config = function()
      vim.cmd("colorscheme midnight")
    end,
  },
  {
    "EdenEast/nightfox.nvim",
    config = function()
      require("nightfox").setup({
        options = {
          -- Compiled file's destination location
          compile_path = vim.fn.stdpath("cache") .. "/nightfox",
          compile_file_suffix = "_compiled", -- Compiled file suffix
          transparent = false,          -- Disable setting background
          terminal_colors = true,       -- Set terminal colors (vim.g.terminal_color_*) used in `:terminal`
          dim_inactive = false,         -- Non focused panes set to alternative background
          module_default = true,        -- Default enable value for modules
          colorblind = {
            enable = false,             -- Enable colorblind support
            simulate_only = false,      -- Only show simulated colorblind colors and not diff shifted
            severity = {
              protan = 0,               -- Severity [0,1] for protan (red)
              deutan = 0,               -- Severity [0,1] for deutan (green)
              tritan = 0,               -- Severity [0,1] for tritan (blue)
            },
          },
          styles = {     -- Style to be applied to different syntax groups
            comments = "NONE", -- Value is any valid attr-list value `:help attr-list`
            conditionals = "NONE",
            constants = "NONE",
            functions = "NONE",
            keywords = "NONE",
            numbers = "NONE",
            operators = "NONE",
            strings = "NONE",
            types = "NONE",
            variables = "NONE",
          },
          inverse = { -- Inverse highlight for different types
            match_paren = false,
            visual = false,
            search = false,
          },
          modules = { -- List of various plugins and additional options
            -- ...
          },
        },
        palettes = {},
        specs = {},
        groups = {},
      })

      -- setup must be called before loading
      -- vim.cmd("colorscheme carbonfox")
    end,
  },
  {
    "baliestri/aura-theme",
    lazy = false,
    priority = 1000,
    config = function(plugin)
      vim.opt.rtp:append(plugin.dir .. "/packages/neovim")
      -- vim.cmd([[colorscheme aura-dark]])
    end,
  },
  {
    "Shatur/neovim-ayu",
    config = function()
      require("ayu").setup({})
    end,
  },
  {
    "olivercederborg/poimandres.nvim",
    lazy = false,
    priority = 1000,
    config = function()
      require("poimandres").setup({
        -- leave this setup function empty for default config
        -- or refer to the configuration section
        -- for configuration options
      })
    end,
  },
}
