# My Tmux Workflow
Hehe I used [`Oh my tmux!`](https://github.com/gpakosz/.tmux) for config my tmux workflow.

## Start new project

```bash
<prefix> + C + c //new session
<prefix> + $ //rename session
cd {project}
<prefix> + d // Close project
```

## Switch project
```
<prefix> + s
<prefix> + C + f // Select project by name
<prefix> + w // Show all windows ^^
```

## Create windows

Docker
```
<prefix> + c
goto docker
<prefix> + , // Rename the window to "Docker"
```
Server
```
ssh to server
<prefix> + , // Rename the window to "server"
```
Git

Editor
```
<prefix> + c
<prefix> + , // Renew the window to 'editor'
vim . // I use NeoVim
```
## Select window
```
<prefix> + 0..9
<prefix> + f // select window by name
```

## Moving windows 
```
C + S + Left
C + S + Right
<prefix> + C + Left
<prefix> + C + Right
```


## Create panes & move on window
```
# Split
<prefix> + - // split window to vertically
<prefix> + _ // split window to horizontally
<prefix> + ! // break the active pane into a new window

# Move
<prefix> + h
<prefix> + j
<prefix> + k
<prefix> + l

<prefix> + q
<prefix> + q + 0..9

# Swap
<prefix> + S + < // Swap pane to left
<prefix> + S + > // Swap pane to right

# Zoom
<prefix> + +
<prefix> + z

# Close
C + d
```


# Mouse mode
```
<prefix> + m
```

# Vim mode on Tmux
[https://waylonwalker.com/tmux-copy-mode/](https://waylonwalker.com/tmux-copy-mode/)
```
<prefix> + Enter : Goto copy mode
begin-selection : Space
copy-selection-and-cancel : Enter 
```
