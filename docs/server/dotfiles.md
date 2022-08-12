# My config set up system: 

[i3wm](https://i3wm.org/docs/refcard.html)
Sway mapping
$mod = Window  
S = shift  

# Mapping keyboard
```
$mod + S + q
$mod + S + c 
$mod + S + b

$mod + S + [0-9]
$mod + S + n
$mod + S + m

$mod + s : Window stacking
$mod + w : Window tabbing
$mod + e : Window splitting

$mod + [0-9] : Switch workspace
$mod + n : New workspace

$mode + S + space : Toggle floating

$mod + f : Toggle full mode
$mod + S + f : Global full

$mod + Enter : Terminal
$mod + d : Menu applications
$mod + S + p 
$mod + S + d

$mod + ?

$mod + S + e


## Moving 

$mod + v
$mod + b

$mod + &#8592 &#8593 &#8594 &#8595 : focus window
$mod + S + &#8592 &#8593 &#8594 &#8595 : move window


```

# Setup after install

Get fastest mirror
```
sudo pacman-mirrors --fasttrack
```

Update the system
```
sudo pacman -Syu
```

Kernel
```
mhwd-kernel -li
mhwd-kernel -l
sudo mhwd-kernel -i linux519-rt
```

Upgrade
```
sudo pacman -Syyu
```

Install base-devel package
```
sudo pacman -S base-devel git --needed 
```

Fix time
```
sudo timedatectl set-local-rtc 1 --adjust-system-clock

```

Install chrome
```
git clone https://aur.archlinux.org/google-chrome.git
cd google-chrome
makepkg -si
```

Fix keyboard
```
echo 0 | sudo tee /sys/module/hid_apple/parameters/fnmode
echo "options hid_apple fnmode=0" | sudo tee -a /etc/modprobe.d/hid_apple.conf
```

install oh-my-zsh
```
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Install tmux
```
sudo pacman -Sy tmux
cd ~
git clone https://github.com/gpakosz/.tmux.git
ln -s -f .tmux/.tmux.conf
cp .tmux/.tmux.conf.local .
```

Install neovim 
```
mv ~/.config/nvim ~/.config/nvim.bak
mv ~/.local/share/nvim/site ~/.local/share/nvim/site.bak

git clone https://github.com/AstroNvim/AstroNvim ~/.config/nvim
nvim +PackerSync
```
