local M = {}

local function search_question(keyword)
  vim.cmd("!leetcode list " .. keyword)
end

M.search_question = search_question() 
