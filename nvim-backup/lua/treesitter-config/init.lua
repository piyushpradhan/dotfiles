require 'nvim-treesitter.configs'.setup {
	ensure_installed = { "c", "cpp", "python", "dart", "javascript", "typescript", "html", "go", "bash", "lua", "rust",
		"prisma" },
	sync_install = false,
	highlight = {
		enable = true,
	},
	indent = {
		enable = true,
	},
}
