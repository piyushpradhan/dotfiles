return require('packer').startup(function()
	use 'wbthomason/packer.nvim'
	use("nvim-lua/plenary.nvim")
	use("nvim-telescope/telescope.nvim")
	use("nvim-lua/popup.nvim")
	use { 'nvim-telescope/telescope-ui-select.nvim' }

	-- Commenting
	use { 'terrortylor/nvim-comment' }
	use {
		"windwp/nvim-autopairs",
		config = function() require("nvim-autopairs").setup {} end
	}

	-- Flutter tool
	use { "akinsho/flutter-tools.nvim", requires = 'nvim-lua/plenary.nvim' }

	-- Git tool
	use("tpope/vim-fugitive")
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
	use {
		"folke/trouble.nvim",
		requires = "kyazdani42/nvim-web-devicons",
	}
	use("nvim-lua/lsp_extensions.nvim")
	use("glepnir/lspsaga.nvim")
	use("simrat39/symbols-outline.nvim")

	-- colorscheme
	use("dylanaraps/wal.vim")
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
	--  lualine
	use {
		'nvim-lualine/lualine.nvim',
		requires = { 'kyazdani42/nvim-web-devicons', opt = true }
	}
	-- notification
	-- use('rcarriga/nvim-notify')
end)
