return require('packer').startup(function()
        use 'wbthomason/packer.nvim'
        use("nvim-lua/plenary.nvim")
        use("nvim-telescope/telescope.nvim")
        use("nvim-lua/popup.nvim")

        use("neovim/nvim-lspconfig")
        use("williamboman/nvim-lsp-installer")
        use('jose-elias-alvarez/null-ls.nvim')
        -- use("tzachar/cmp-tabnine", { run = "./install.sh" })
        use("hrsh7th/cmp-nvim-lsp")
        use("hrsh7th/cmp-buffer")
        use("hrsh7th/nvim-cmp")
        use('hrsh7th/vim-vsnip')
        use('hrsh7th/vim-vsnip-integ')
        -- use("tzachar/cmp-tabnine", { run = "./install.sh" })
        use("onsails/lspkind-nvim")
        use("nvim-lua/lsp_extensions.nvim")
        use("glepnir/lspsaga.nvim")
        use("simrat39/symbols-outline.nvim")

        -- colorscheme 
        use("gruvbox-community/gruvbox")
        use("folke/tokyonight.nvim")
        
        use("nvim-treesitter/nvim-treesitter", {
            run = ":TSUpdate"
        })

        use("nvim-treesitter/playground")
        use("romgrk/nvim-treesitter-context")
        -- nvim-tree
        use {
          'kyazdani42/nvim-tree.lua',
          requires = {
            'kyazdani42/nvim-web-devicons', -- optional, for file icons
          },
          tag = 'nightly' -- optional, updated every week. (see issue #1193)
        }
end)
