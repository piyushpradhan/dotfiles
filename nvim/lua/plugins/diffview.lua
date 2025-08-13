return {
	"sindrets/diffview.nvim",
	config = function()
		vim.keymap.set("n", "gv", ":DiffviewOpen<CR>")
		vim.keymap.set("n", "gc", ":DiffviewClose<CR>")
		vim.keymap.set("n", "gh", ":DiffviewFileHistory<CR>")
		vim.keymap.set("n", "gf", ":DiffviewToggleFiles<CR>")
	end,
}
