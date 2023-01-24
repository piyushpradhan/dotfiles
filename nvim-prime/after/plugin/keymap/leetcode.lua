local Remap = require("mediocre.keymap")
local nnoremap = Remap.nnoremap

nnoremap("<Leader>lce", function()
  require("leetcode").pick_leetcode_problem("easy")
end)

nnoremap("<Leader>lcm", function()
  require("leetcode").pick_leetcode_problem("medium")
end)

nnoremap("<Leader>lch", function()
  require("leetcode").pick_leetcode_problem("hard")
end)
