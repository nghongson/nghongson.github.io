"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9991],{6514:(n,e,o)=>{o.r(e),o.d(e,{assets:()=>i,contentTitle:()=>c,default:()=>m,frontMatter:()=>t,metadata:()=>d,toc:()=>l});var s=o(4848),r=o(8453);const t={},c="My config setup system",d={id:"workflow/dotfiles",title:"My config setup system",description:"Get fastest mirror",source:"@site/docs/workflow/dotfiles.md",sourceDirName:"workflow",slug:"/workflow/dotfiles",permalink:"/docs/workflow/dotfiles",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"My Workflow",permalink:"/docs/category/my-workflow"},next:{title:"My Tmux Workflow",permalink:"/docs/workflow/tmux-workflow"}},i={},l=[{value:"i3wm",id:"i3wm",level:2},{value:"Mapping keyboard",id:"Mapping-keyboard",level:3}];function a(n){const e={a:"a",br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,r.R)(),...n.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(e.h1,{id:"My-config-setup-system",children:"My config setup system"}),"\n",(0,s.jsx)(e.h1,{id:"Setup-after-install",children:"Setup after install"}),"\n",(0,s.jsx)(e.p,{children:"Get fastest mirror"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"sudo pacman-mirrors --fasttrack\n"})}),"\n",(0,s.jsx)(e.p,{children:"Update the system"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"sudo pacman -Syu\n"})}),"\n",(0,s.jsx)(e.p,{children:"Kernel"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"mhwd-kernel -li\nmhwd-kernel -l\nsudo mhwd-kernel -i linux519-rt\n"})}),"\n",(0,s.jsx)(e.p,{children:"Upgrade"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"sudo pacman -Syyu\n"})}),"\n",(0,s.jsx)(e.p,{children:"Install base-devel package"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"sudo pacman -S base-devel git --needed \n"})}),"\n",(0,s.jsx)(e.p,{children:"Fix time"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"sudo pacman -S ntp\nsudo systemctl start ntpd.service\nsudo timedatectl set-local-rtc 1 --adjust-system-clock\n\n"})}),"\n",(0,s.jsx)(e.p,{children:"Install chrome"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"git clone https://aur.archlinux.org/google-chrome.git\ncd google-chrome\nmakepkg -si\n"})}),"\n",(0,s.jsx)(e.p,{children:"Fix keyboard"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:'echo 0 | sudo tee /sys/module/hid_apple/parameters/fnmode\necho "options hid_apple fnmode=0" | sudo tee -a /etc/modprobe.d/hid_apple.conf\n'})}),"\n",(0,s.jsx)(e.p,{children:"install oh-my-zsh"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:'sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"\n'})}),"\n",(0,s.jsx)(e.p,{children:"Install tmux"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"sudo pacman -Sy tmux\ncd ~\ngit clone https://github.com/gpakosz/.tmux.git\nln -s -f .tmux/.tmux.conf\ncp .tmux/.tmux.conf.local .\n"})}),"\n",(0,s.jsx)(e.p,{children:"Install neovim"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"mv ~/.config/nvim ~/.config/nvim.bak\nmv ~/.local/share/nvim/site ~/.local/share/nvim/site.bak\n\ngit clone https://github.com/AstroNvim/AstroNvim ~/.config/nvim\nnvim +PackerSync\n"})}),"\n",(0,s.jsx)(e.p,{children:"Asus setup"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"/etc/pacman.conf\n[g14]\nSigLevel = DatabaseNever Optional TrustAll\nServer = https://arch.asus-linux.org\n\npacman -Suy\n\npacman -S asusctl\n\nsystemctl enable --now power-profiles-daemon.service\n\npacman -S supergfxctl\n\nsystemctl enable --now supergfxd\n"})}),"\n",(0,s.jsx)(e.p,{children:"Applications"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"sudo pacman -Sy neofetch\nsudo pacman -Sy evince // PDF viewer\nsudo pacman -Sy ranger \nsudo pacman -Sy mkcert\n\n"})}),"\n",(0,s.jsx)(e.p,{children:"Auto Mount"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"sudo nvim /etc/fstab\nlsblk -f\n\nUUID={UUID}  {MOUNT_FOLDER} ext4 defaults 0 2\n"})}),"\n",(0,s.jsx)(e.h2,{id:"i3wm",children:(0,s.jsx)(e.a,{href:"https://i3wm.org/docs/refcard.html",children:"i3wm"})}),"\n",(0,s.jsxs)(e.p,{children:["Sway mapping\n$mod = Window",(0,s.jsx)(e.br,{}),"\n","S = shift"]}),"\n",(0,s.jsx)(e.h3,{id:"Mapping-keyboard",children:"Mapping keyboard"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"$mod + S + q\n$mod + S + c \n$mod + S + b\n\n$mod + S + [0-9]\n$mod + S + n\n$mod + S + m\n\n$mod + s : Window stacking\n$mod + w : Window tabbing\n$mod + e : Window splitting\n\n$mod + [0-9] : Switch workspace\n$mod + n : New workspace\n\n$mode + S + space : Toggle floating\n\n$mod + f : Toggle full mode\n$mod + S + f : Global full\n\n$mod + Enter : Terminal\n$mod + d : Menu applications\n$mod + S + p \n$mod + S + d\n\n$mod + ?\n\n$mod + S + e\n\n\n## Moving \n\n$mod + v\n$mod + b\n\n$mod + &#8592 &#8593 &#8594 &#8595 : focus window\n$mod + S + &#8592 &#8593 &#8594 &#8595 : move window\n\n\n"})})]})}function m(n={}){const{wrapper:e}={...(0,r.R)(),...n.components};return e?(0,s.jsx)(e,{...n,children:(0,s.jsx)(a,{...n})}):a(n)}},8453:(n,e,o)=>{o.d(e,{R:()=>c,x:()=>d});var s=o(6540);const r={},t=s.createContext(r);function c(n){const e=s.useContext(t);return s.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function d(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(r):n.components||r:c(n.components),s.createElement(t.Provider,{value:e},n.children)}}}]);