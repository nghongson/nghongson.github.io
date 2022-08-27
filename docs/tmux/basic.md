# Basic concepts
The hierarchy is that Tmux could have multiple sessions, a session could have multiple windows, a window could have multiple panes. On the server, users could follow certain conventions or rules to manage Tmux. For example, we could create a session for a specific project. In the project session, we could create multiple windows, and each window would be used for each specific task for the project. In the window, in order to finish the task more efficiently, we create multiple panes for purposes such as process monitoring and file management.

Session: Groups one or more windows together
## Sessions
```
<prefix> + Ctrl + c : Create new session
<prefix> + $ : Rename session
<prefix> + d : Kill session
<prefix> + s : list sessions 
<prefix> + w : preview sessions
<prefix> + Ctrl + f : find session by name
```
### Create sessions

```
$ tmux
$ tmux new
$ tmux new-session
```

### Detach Sessions

```
$ exit
```

### View Sessions

```
$ tmux ls
$ tmux list-sessions
```
In Tmux terminal, we check Tmux sessions by hitting `Ctrl + b + s`.

### Rename Sessions

```
$ tmux rename-session [-t session-name] [new-session-name]
```

## Windows

### Create/Close Windows

```
<prefix> + c : Create window
<prefix> + , : Rename window
<prefix> + & : Close window
```

### Navigation Windows
```
<prefix> + 0..9
```
## Panes
Each window in the session could have multiple panes

### Create Panes
Split to the pane varically or the pane horizontal
```
<prefix> + % : split the pane vertically
<prefix> + " : split the pane horizontally
```
### Kill Pane
```
<prefix> + x
```

### Navigation
```
<prefix> + q : Show pane numbers
<prefix> + q 0..9 : Switch pane by number
```

### Zoom
```
<prefix> + + : Toggle maximum pane
<prefix> + z : Toggle pane zoom
```
