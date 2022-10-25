let mapleader = "\<Space>"
nnoremap <leader>v :source $XDG_CONFIG_HOME/nvim/init.vim<CR>
nnoremap <leader>s :source $XDG_CONFIG_HOME/nvim/ytmp.vim<CR>
nnoremap <leader>c :e $XDG_CONFIG_HOME/nvim/ytmp.vim<CR>
nnoremap <leader>n :e $USER/Music/ytmp/run_on_next<CR>

" au BufEnter * norm zz

set ignorecase
set nohlsearch
set number relativenumber

set autoread
set noshowmode
set noruler
set laststatus=0
set noshowcmd

nnoremap <Up> ddkP:w<Enter>
nnoremap <Down> ddp:w<Enter>
nnoremap <Left> dd/\*\*\*$/<Esc>nP:w<Enter>
nnoremap <Right> dd/\*\*\*$/<Esc>np:w<Enter>
nnoremap <S-Up> Gdd/\*\*\*$/<Esc>p:w<Enter>
nnoremap <S-Down> ggdd/\*\*\*$/<Esc>p:w<Enter>
nnoremap <S-Right> ddGp:w<Enter>
nnoremap <S-Left> ddggP:w<Enter>
" nnoremap <Enter> ml/\*\*\*$/<Esc>0Wde$bD'lWi***<Esc>A***<Esc>
" nnoremap <Enter> :te iytmp
" nnoremap <Enter> 0Wy$:execute '! ytmp e '.shellescape(@", 1)<Enter>
nnoremap <Enter> :let l = line('.')<Enter>:execute '! ytmp ee '.shellescape(l)<Enter>

nnoremap d dd
nnoremap r :e!<Enter>
nnoremap R /\*\*\*$/<Esc>:s/\*\*\*//g<Enter>:w<Enter>
nnoremap W :w!<Enter>
nnoremap J /\*\*\*$/<Esc>mp
nnoremap ? :vimgrep //f %<Left><Left><Left><Left>

nnoremap <C-s> :te ytmp v<Enter>i
nnoremap <C-t> :te <Enter>i
nnoremap <C-y> :te ytmp<Enter>i
nnoremap <C-w> :te ytmp S<Enter>i
