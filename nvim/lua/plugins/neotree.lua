return {
  "nvim-neo-tree/neo-tree.nvim",
  branch = "v3.x",
  lazy = false, -- Load at startup so toggle is instant (avoids lazy-load delay)
  dependencies = {
    "nvim-lua/plenary.nvim",
    "MunifTanjim/nui.nvim",
    "nvim-tree/nvim-web-devicons",
  },
  opts = {
    close_if_last_window = false,
    hijack_netrw_behavior = "open_default",
    window = {
      position = "left",
      width = 40,
    },
    filesystem = {
      follow_current_file = { enabled = false }, -- Reduces rescans on buffer switch
      use_libuv_file_watcher = false,
      filtered_items = {
        hide_dotfiles = true,
        hide_gitignored = true,
      },
    },
  },
}
