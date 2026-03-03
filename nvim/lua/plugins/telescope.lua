return {
  "nvim-telescope/telescope.nvim",
  dependencies = { "nvim-lua/plenary.nvim" },
  cmd = "Telescope",
  keys = {
    { "<leader>pf", "<cmd>Telescope find_files<cr>", desc = "Find files" },
    { "<leader>pw", "<cmd>Telescope live_grep<cr>", desc = "Live grep" },
    { "<leader>\\", "<cmd>Telescope buffers<cr>", desc = "Buffers" },
    { "<leader>ph", "<cmd>Telescope help_tags<cr>", desc = "Help tags" },
    { "<leader>pr", "<cmd>Telescope oldfiles<cr>", desc = "Recent files" },
  },
  opts = {
    defaults = {
      layout_strategy = "horizontal",
      layout_config = { prompt_position = "top" },
      sorting_strategy = "ascending",
      winblend = 0,
    },
  },
}
