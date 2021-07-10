" Tabs
set tabstop=4 softtabstop=4
set shiftwidth=4
set expandtab
set smartindent

" Custom executions 
set exrc

" Cursor shape
set guicursor=

" Line numbers
set number
set relativenumber

" Highlighting
set nohlsearch

" Keeps buffers open
set hidden

set noerrorbells
set nowrap
set smartcase
set ignorecase

" removing swap files and history management 
set noswapfile
set nobackup 
set undodir=~/.vim/undodir
set undofile

set incsearch

" start scrolling when 8 lines offset
set scrolloff=8

set noshowmode 
set completeopt=menuone,noinsert,noselect

" linting or error messages
set signcolumn=yes

" give a little more space for displaying messages
set cmdheight=2

" default is 4000ms
set updatetime=50

" don't pass messages to |ins-completion-menu|
set shortmess+=c

set wildmode=longest,list,full
set wildmenu

" ignore directories
set wildignore+=*.pyc
set wildignore+=*_build/*
set wildignore+=**/coverage/*
set wildignore+=**/node_modules/*
set wildignore+=*/node_modules/*
set wildignore+=**/ios/*
set wildignore+=**/.git/*

call plug#begin('~/.vim/plugged')

    " Bujo Task manageer
    Plug 'vuciv/vim-bujo'

    " Icons
    Plug 'ryanoasis/vim-devicons'
    Plug 'kristijanhusak/defx-icons'

    " Autocompletion
    Plug 'neoclide/coc.nvim', {'branch': 'release'}
				
    Plug 'itchyny/lightline.vim'
    Plug 'kien/ctrlp.vim'

    " File explorer
    Plug 'scrooloose/nerdtree', { 'on':  'NERDTreeToggle' }
    Plug 'preservim/nerdtree'
    Plug 'tiagofumo/vim-nerdtree-syntax-highlight'

    " Debugger Plugins
    Plug 'puremourning/vimspector'
    Plug 'szw/vim-maximizer'

    " Telescope 
    Plug 'nvim-lua/popup.nvim'
    Plug 'nvim-lua/plenary.nvim'
    Plug 'nvim-telescope/telescope.nvim'
    Plug 'nvim-telescope/telescope-fzy-native.nvim'

    Plug 'mbbill/undotree'

    " Git 
    Plug 'tpope/vim-fugitive'
    
    " Frameworks and languages
    Plug 'pangloss/vim-javascript'
    Plug 'leafgarland/typescript-vim'
    Plug 'maxmellon/vim-jsx-pretty'

    " Code completion 
    Plug 'neovim/nvim-lspconfig'

    " Prettier
    Plug 'prettier/vim-prettier', { 'do': 'yarn install', 'for': ['javascript', 'typescript', 'css', 'less', 'scss', 'json', 'graphql', 'markdown', 'vue', 'yaml', 'html'] }
    
    Plug 'morhetz/gruvbox'
    Plug 'dylanaraps/wal.vim'
call plug#end()



colorscheme wal
highlight Normal guibg=None 

let mapleader = " "

" Telescope config
nnoremap <leader><space> :Telescope git_files<CR>
" nnoremap <leader>ff :Telescope live_grep<CR>
nnoremap <leader>fo :Telescope file_browser<CR>
nnoremap <leader>ff :Telescope find_files<CR>
nnoremap <leader>fb :Telescope buffers<CR>
nnoremap <leader>fg :Telescope git_branches<CR>
nnoremap <leader>fs :Telescope lsp_document_symbols<CR>
nnoremap <leader>FF :Telescope grep_string<CR>

" NERDTree config

autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * NERDTree

let g:NERDTreeGitStatusWithFlags = 1
"let g:WebDevIconsUnicodeDecorateFolderNodes = 1
"let g:NERDTreeGitStatusNodeColorization = 1
"let g:NERDTreeColorMapCustom = {
    "\ "Staged"    : "#0ee375",  
    "\ "Modified"  : "#d9bf91",  
    "\ "Renamed"   : "#51C9FC",  
    "\ "Untracked" : "#FCE77C",  
    "\ "Unmerged"  : "#FC51E6",  
    "\ "Dirty"     : "#FFBD61",  
    "\ "Clean"     : "#87939A",   
   "\ "Ignored"   : "#808080"   
    "\ }                         

nmap <C-n> :NERDTreeToggle<CR>

let g:NERDTreeIgnore = ['^node_modules$']

" sync open file with NERDTree
" " Check if NERDTree is open or active
function! IsNERDTreeOpen()        
  return exists("t:NERDTreeBufName") && (bufwinnr(t:NERDTreeBufName) != -1)
endfunction

" Call NERDTreeFind iff NERDTree is active, current window contains a modifiable
" file, and we're not in vimdiff
function! SyncTree()
  if &modifiable && IsNERDTreeOpen() && strlen(expand('%')) > 0 && !&diff
    NERDTreeFind
    wincmd p
  endif
endfunction

" Highlight currently open buffer in NERDTree
autocmd BufEnter * call SyncTree()


" Devicons config

set guifont=Sauce\ Code\ Pro\ Light\ Nerd\ Font\ Complete\ Windows\ Compatible:h11
let g:webdevicons_enable_vimfiler = 1


" CtrlP Config
let g:ctrlp_map = '<c-p>'
let g:ctrlp_cmd = 'CtrlP'
let g:ctrlp_working_path_mode = 'ra'

let g:ctrlp_custom_ignore = '\v[\/]\.(git|hg|svn)$'
let g:ctrlp_custom_ignore = {
    \ 'dir':  '\v[\/]\.(git|hg|svn)$',
    \ 'file': '\v\.(exe|so|dll)$',
    \ 'link': 'some_bad_symbolic_links',
    \ }

"-------------------------
" Remaps 
"-------------------------

" searching for files inside a project directory
nnoremap <leader>ps :lua require('telescope.builtin').grep_string({ search = vim.fn.input("Grep For > ")})<CR>

" vimspector HUMAN keymapping
let g:vimspector_enable_mappings='HUMAN'"

" Fugitive key bindings
nmap <leader>gl :diffget //3<CR>
nmap <leader>gh :diffget //2<CR>
nmap <leader>gs :G<CR>

" pure remap
source ~/.vimrc.maps
" lighline 
source ~/.vimrc.lightline 
