-- since this is just an example spec, don't actually load anything here and return an empty spec
-- stylua: ignore
if true then return {} end

-- every spec file under the "plugins" directory will be loaded automatically by lazy.nvimk
--
-- In your plugin files, you can:
-- * add extra plugins
-- * disable/enabled LazyVim plugins
-- * override the configuration of LazyVim plugins
return {
  -- LSP and completion
  "neovim/nvim-lspconfig",
  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      "hrsh7th/cmp-emoji",
      "L3MON4D3/LuaSnip",
    },
    opts = function(_, opts)
      table.insert(opts.sources, { name = "emoji" })
    end,
  },
  "onsails/lspkind-nvim",
  "hrsh7th/cmp-buffer",
  "hrsh7th/cmp-nvim-lsp",
  "jose-elias-alvarez/null-ls.nvim",
  "williamboman/mason.nvim",
  "williamboman/mason-lspconfig.nvim",
  {
    "glepnir/lspsaga.nvim",
    event = "LspAttach",
    config = function()
      require("lspsaga").setup({})
    end,
    dependencies = {
      { "nvim-tree/nvim-web-devicons" },
      { "nvim-treesitter/nvim-treesitter" },
    },
  },

  -- Treesitter
  {
    "nvim-telescope/telescope-file-browser.nvim",
    dependencies = { "nvim-telescope/telescope.nvim", "nvim-lua/plenary.nvim" },
  },

  {
    "debugloop/telescope-undo.nvim",
    dependencies = { -- note how they're inverted to above example
      {
        "nvim-telescope/telescope.nvim",
        dependencies = { "nvim-lua/plenary.nvim" },
      },
    },
    keys = {
      { -- lazy style key map
        "<leader>u",
        "<cmd>Telescope undo<cr>",
        desc = "undo history",
      },
    },
    opts = {
      -- don't use `defaults = { }` here, do this in the main telescope spec
      extensions = {
        undo = {
          -- telescope-undo.nvim config, see below
        },
        -- no other extensions here, they can have their own spec too
      },
    },
    config = function(_, opts)
      -- Calling telescope's setup from multiple specs does not hurt, it will happily merge the
      -- configs for us. We won't use data, as everything is in it's own namespace (telescope
      -- defaults, as well as each extension).
      require("telescope").setup(opts)
      require("telescope").load_extension("undo")
    end,
  },
  -- Git
  "lewis6991/gitsigns.nvim",
  "dinhhuy258/git.nvim",
  "tpope/vim-fugitive",
  "sindrets/diffview.nvim",
  "ThePrimeagen/git-worktree.nvim",

  -- UI and aesthetics
  {
    "nvim-lualine/lualine.nvim",
    event = "VeryLazy",
    opts = function(_, opts)
      table.insert(opts.sections.lualine_x, "😄")
    end,
  },
  "kyazdani42/nvim-web-devicons",
  "akinsho/nvim-bufferline.lua",
  { "ellisonleao/gruvbox.nvim" },
  "nyoom-engineering/oxocarbon.nvim",
  "polirritmico/monokai-nightasty.nvim",
  "Shatur/neovim-ayu",
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "gruvbox",
    },
  },

  -- Editing and navigation
  "windwp/nvim-autopairs",
  "windwp/nvim-ts-autotag",
  {
    "numToStr/Comment.nvim",
    dependencies = {
      "JoosepAlviste/nvim-ts-context-commentstring",
    },
  },
  "folke/zen-mode.nvim",
  {
    "iamcco/markdown-preview.nvim",
    build = function()
      vim.fn["mkdp#util#install"]()
    end,
  },
  {
    "nvim-tree/nvim-tree.lua",
    dependencies = {
      "nvim-tree/nvim-web-devicons",
    },
  },
  "MunifTanjim/prettier.nvim",
  "nathanaelkane/vim-indent-guides",
  {
    "SmiteshP/nvim-navic",
    dependencies = "neovim/nvim-lspconfig",
  },
  "heavenshell/vim-jsdoc",
  {
    "rmagatti/goto-preview",
    config = function()
      require("goto-preview").setup({})
    end,
  },
  { "kevinhwang91/nvim-ufo", dependencies = "kevinhwang91/promise-async" },

  -- Language-specific
  { import = "lazyvim.plugins.extras.lang.typescript" },
  { import = "lazyvim.plugins.extras.lang.json" },

  -- Misc
  "nvim-lua/plenary.nvim",
  { import = "lazyvim.plugins.extras.ui.mini-starter" },
  {
    "williamboman/mason.nvim",
    opts = {
      ensure_installed = {
        "stylua",
        "shellcheck",
        "shfmt",
        "flake8",
      },
    },
  },
}
