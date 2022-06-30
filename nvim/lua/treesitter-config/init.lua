require'nvim-treesitter.configs'.setup {
	ensure_installed = {"c", "cpp", "python", "dart", "javascript", "typescript", "html", "go", "bash", "markdown", "lua", "rust"},
	sync_install = false, 
	highlight = {
		enable = true,
	}, 
	indent = {
		enable = true,
	},
}
