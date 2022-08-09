# My dotfiles

System : 

[i3wm](https://i3wm.org/docs/refcard.html)
Sway mapping

$mod = Window
S = shift
mapping :
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

Setup after install

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

Install chrome
```
git clone https://aur.archlinux.org/google-chrome.git
cd google-chrome
makepkg -si
```
