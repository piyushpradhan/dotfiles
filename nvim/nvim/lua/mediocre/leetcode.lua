local Job = require("plenary.job")
local finders = require("telescope.finders")
local pickers = require("telescope.pickers")
local conf = require("telescope.config").values
local actions = require("telescope.actions")
local action_state = require("telescope.actions.state")

local M = {}

local MAIN_WIDTH = 0
local MAIN_HEIGHT = 0

local easy_problems = {}
local medium_problems = {}
local hard_problems = {}

local function get_problem_id(problem_title)
  local id = string.match(problem_title, "%[(.-)%]")
  return id
end

local function get_problem(problem_id)
  local stdout_results = {}
  local job = Job:new {
    command = "leetcode",
    args = { "show", problem_id },
    on_stdout = function(_, line)
      table.insert(stdout_results, line)
    end
  }
  job:sync()
  return stdout_results
end

local function generate_boilerplate(problem_id)
  local stdout_results = {}
  local job = Job:new{
    command = "leetcode",
    args = { "show", problem_id, "-gc", "-o", "/home/mediocre/.leetcode"},
    on_stdout = function (_, line)
      table.insert(stdout_results, line)
    end
  }
  job:sync()
  vim.cmd('e '..'/home/mediocre/.leetcode/'..problem_id..'*')
end

local function get_nvim_size()
  local uis = vim.api.nvim_list_uis()
  local width = 0
  local height = 0
  for i = 1, #uis do
    width = width + uis[i].width
    height = height + uis[i].height
  end
  return width, height
end

local function write_stuff(bufnr, content)
  local problem = {}
  local problem_id = get_problem_id(content["value"])
  local problem_details = get_problem(problem_id)
  for _, v in pairs(problem_details) do
    table.insert(problem, v)
  end
  vim.api.nvim_buf_set_text(bufnr, 0, 0, 0, 0, problem)
  vim.bo[bufnr].modifiable = false
  vim.bo[bufnr].readonly = true
end

local function create_window(content)
  local id = vim.api.nvim_create_buf(false, true);
  vim.bo[id].modifiable = true
  vim.bo[id].bufhidden = true
  local width, height = get_nvim_size()
  MAIN_WIDTH = width
  MAIN_HEIGHT = height
  local dialog_width = math.ceil((width * 3) / 4)
  local dialog_height = math.ceil((height * 3) / 4)
  local offset_row = math.ceil((MAIN_HEIGHT - dialog_height) / 2)
  local offset_col = math.floor((MAIN_WIDTH - dialog_width) / 2)

  vim.api.nvim_open_win(
    id,
    true,
    {
      relative = "win",
      row = offset_row,
      col = offset_col,
      width = dialog_width,
      height = dialog_height
    })

  write_stuff(id, content)
end

local function get_easy_problems()
  local job = Job:new {
    command = "leetcode",
    args = { "list", "-q", "eL" },
    on_stdout = function(_, line)
      table.insert(easy_problems, line)
    end
  }
  job:sync()
  return easy_problems
end

local function get_medium_problems()
  local stdout_results = {}
  local job = Job:new {
    command = "leetcode",
    args = { "list", "-q", "mL" },
    on_stdout = function(_, line)
      table.insert(stdout_results, line)
    end
  }
  job:sync()
  return stdout_results
end

local function get_hard_problems()
  local stdout_results = {}
  local job = Job:new {
    command = "leetcode",
    args = { "list", "-q", "hL" },
    on_stdout = function(_, line)
      table.insert(stdout_results, line)
    end
  }
  job:sync()
  return stdout_results
end

local function open_problem(prompt_bufnr, map)
  map("i", "<CR>", function()
    local selection = action_state.get_selected_entry(prompt_bufnr)
    local problem_id = get_problem_id(selection["value"])
    actions.close(prompt_bufnr)
    generate_boilerplate(problem_id)
    create_window(selection)
  end)
end

local function filter_problem(diff)
  if diff == "easy" then
    return get_easy_problems()
  elseif diff == "medium" then
    return get_medium_problems()
  elseif diff == "hard" then
    return get_hard_problems()
  end
end

local function set_title(diff)
  if diff == "hard" then
    return "Hard Problems"
  elseif diff == "medium" then
    return "Medium problems"
  elseif diff == "easy" then
    return "Easy problems"
  end
end

function M.pick_leetcode_problem(difficulty)
  local a = function(e)
    return {
      ordinal = e,
      display = e,
      value = e,
    }
  end

  pickers.new({}, {
    prompt_title = set_title(difficulty),
    finder = finders.new_table {
      results = filter_problem(difficulty),
      entry_maker = a,
    },
    sorter = conf.generic_sorter({}),
    attach_mappings = function(prompt_bufnr, map)
      open_problem(prompt_bufnr, map)
      return true
    end,
    previewer = false,
  }):find()
end

return M
