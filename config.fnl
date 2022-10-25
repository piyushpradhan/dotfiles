(require-macros :macros)
;; Place your private configuration here! Remember, you do not need to run 'nyoom
;; sync' after modifying this file!

;; There are two ways to load a theme. Both assume the theme is installed and
;; available. You can either set 'colorscheme' or manually load a theme through
;; 'require' function. This is the default:
(colorscheme oxocarbon-lua)

;; The set! macro sets vim.opt options. By default it sets the option to true 
;; Appending `no` in front sets it to false. This determines the style of line 
;; numbers in effect. If set to nonumber, line numbers are disabled. For 
;; relative line numbers, set 'relativenumber`
(set! nonumber)

;; The let option sets global, or `vim.g` options. 
;; Heres an example with localleader, setting it to <space>m
;; (let! maplocalleader " m")
(let! mapleader " ")
;; map! is used for mappings
;; Heres an example, preseing esc should also remove search highlights
(map! [n] "<esc>" "<esc><cmd>noh<cr>")
(map! [i] "jk" "<esc>")

;; Delete without yanking
(map! [n] "x" "\"_x")
;; Delete a word backwards
(map! [n] "dw" "vb\"_d")

;; Tabs
(map! [n] "te" ":tabedit")
(map! [n] "<S-Tab>" ":tabprev<cr>")
(map! [n] "<Tab>" ":tabnext<cr>")

;; Window navigation
(map! [n] "ss" ":split<cr><C-w>w")
(map! [n] "sv" ":vsplit<cr><C-w>h")

(map! [n] "sh" "<C-w>h")
(map! [n] "sk" "<C-w>k")
(map! [n] "sj" "<C-w>j")
(map! [n] "sl" "<C-w>l")

;; Resize window
(map! [n] "s<Left>" "<C-w><")
(map! [n] "s<Up>" "<C-w>+")
(map! [n] "s<Down>" "<C-w>-")
(map! [n] "s<Right>" "<C-w>>")

;; Shifting lines
(map! [v] "J" ":m \'>+1<CR>gv=gv")
(map! [v] "K" ":m \'>-2<CR>gv=gv")

;; Save current buffer
(map! [n] "<leader>s" ":s<cr>")

;; Moving windows
(map! [n] "<S-s>j" "<C-w>J")
(map! [n] "<S-s>k" "<C-w>K")
(map! [n] "<S-s>l" "<C-w>L")
(map! [n] "<S-s>h" "<C-w>H")

;; Shows the undo tree
(map! [n] "<leader>u" ":Undotreeshow<cr>")

;; C++ compilation shortcut
(map! [n] "<leader>cpp" ":!g++ %;./a.out<cr>")

;; Poke around the Nyoom code for more! The following macros are also available:
;; contains? check if a table contains a value
;; custom-set-face! use nvim_set_hl to set a highlight value
;; set! set a vim option
;; local-set! buffer-local set!
;; command! create a vim user command
;; local-command! buffer-local command!
;; autocmd! create an autocmd
;; augroup! create an augroup
;; clear! clear events
;; packadd! force load a plugin from /opt
;; colorscheme set a colorscheme
;; map! set a mapping
;; buf-map! bufer-local mappings
;; let! set a vim global
;; echo!/warn!/err! emit vim notifications
