"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4656],{897:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>t,contentTitle:()=>c,default:()=>p,frontMatter:()=>i,metadata:()=>o,toc:()=>l});var s=r(4848),d=r(8453);const i={},c=void 0,o={id:"server/linux/Hardware info",title:"Hardware info",description:"CPU",source:"@site/docs/server/linux/Hardware info.md",sourceDirName:"server/linux",slug:"/server/linux/Hardware info",permalink:"/docs/server/linux/Hardware info",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Linux",permalink:"/docs/category/linux"},next:{title:"AWK command",permalink:"/docs/server/linux/awk"}},t={},l=[];function a(e){const n={a:"a",code:"code",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"CPU"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"sudo dmidecode -t processor;\ncat /proc/cpuinfo\nlshw -C cpu;\nlscpu\n"})}),"\n",(0,s.jsx)(n.p,{children:"Mainboard"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"sudo dmidecode -t baseboard;\n"})}),"\n",(0,s.jsx)(n.p,{children:"GPU"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"lshw -C display\nlspci | grep VGA\nnvidia-smi\n"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://gist.github.com/neomatrix369/256913dcf77cdbb5855dd2d7f5d81b84",children:"https://gist.github.com/neomatrix369/256913dcf77cdbb5855dd2d7f5d81b84"}),"\nRAM"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'sudo dmidecode -t memory\nsudo dmidecode -t memory | grep -i size\nlshw -C memory\nlspci | grep "RAM Memory"\n\nfree -m\n'})}),"\n",(0,s.jsx)(n.p,{children:"Disks"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"lshw -short -C disk\nlsblk\nfdisk -l\ndf -m\nlsusb\n"})}),"\n",(0,s.jsx)(n.p,{children:"Network"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"lshw -C network\nifconfig -a\n\n"})}),"\n",(0,s.jsx)(n.p,{children:"Bios"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"dmidecode -t bios\n"})}),"\n",(0,s.jsx)(n.p,{children:"Kernel"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"uname -a\n"})})]})}function p(e={}){const{wrapper:n}={...(0,d.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>c,x:()=>o});var s=r(6540);const d={},i=s.createContext(d);function c(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:c(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);