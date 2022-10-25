local null_ls = require("null-ls")
local prettier = require("prettier")

null_ls.setup({
	on_attach = function(client, bufnr)
		-- vim.cmd("nnoremap <silent><buffer> <Leader>f :lua vim.lsp.buf.formatting()<CR>")
		-- format on save
		-- vim.cmd("autocmd BufWritePost <buffer> lua vim.lsp.buf.formatting()")
		vim.cmd("autocmd BufWritePost <buffer> Prettier")
	end,
})

prettier.setup({
	bin = 'prettier', -- or `prettierd`
	filetypes = {
		"css",
		"graphql",
		"html",
		"javascript",
		"javascriptreact",
		"json",
		"less",
		"markdown",
		"scss",
		"typescript",
		"typescriptreact",
		"yaml",
		"python",
		"cpp",
		"c",
		"kotlin",
		"dart",
		"bash",
	},

	-- prettier format options (you can use config files too. ex: `.prettierrc`)
	arrow_parens = "always",
	bracket_spacing = true,
	embedded_language_formatting = "auto",
	end_of_line = "lf",
	html_whitespace_sensitivity = "css",
	jsx_bracket_same_line = false,
	jsx_single_quote = false,
	print_width = 80,
	prose_wrap = "preserve",
	quote_props = "as-needed",
	semi = true,
	single_quote = true,
	tab_width = 2,
	trailing_comma = "all",
	use_tabs = true,
})
