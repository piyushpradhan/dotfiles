local http_request = require 'http.request'
local lunajson = require 'lunajson'

local uri = 'https://animechan.vercel.app/api/random'

local function execute_cpp()
  vim.api.nvim_command('bel vsplit /tmp/result')
  vim.api.nvim_win_set_width(0, 50)
end

local function other_function()
  local api = vim.api
  api.nvim_command('botright split new') 
  api.nvim_win_set_height(0, 30)
end

local function some_function()
  local headers, stream = assert(http_request.new_from_uri(uri):go())
  if stream ~= nil then
	local body = assert(stream:get_body_as_string())
	if headers:get ':status' ~= '200' then
	  error(body)
	end
	local decoded = lunajson.decode(body)['quote']
	print(decoded)
  end
end

return {
  some_function = some_function,
  other_function = other_function,
  execute_cpp = execute_cpp
}
