"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5248],{7407:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>a,contentTitle:()=>s,default:()=>m,frontMatter:()=>c,metadata:()=>d,toc:()=>i});var r=o(4848),t=o(8453);const c={},s="Setup docker",d={id:"server/docker/basic",title:"Setup docker",description:"Install docker",source:"@site/docs/server/docker/basic.md",sourceDirName:"server/docker",slug:"/server/docker/basic",permalink:"/docs/server/docker/basic",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Docker",permalink:"/docs/category/docker"},next:{title:"Docker Mac version",permalink:"/docs/server/docker/docker-mac"}},a={},i=[];function l(e){const n={code:"code",h1:"h1",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"Setup-docker",children:"Setup docker"}),"\n",(0,r.jsx)(n.p,{children:"Install docker"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"sudo pacman -Sy docker\nsudo systemctl start docker.service\nsudo systemctl enable docker.service\nsudo usermod -aG docker $USER\n\t\ndocker run hello-world\n\nsudo pacman -Sy docker-compose\n\n#add more lines /etc/sysctl.conf\nvm.overcommit_memory=1\nvm.max_map_count=262144\nnet.core.somaxconn=65535\nsysctl --system //Reload sysctl vars\n\n#live system\nsysctl -w vm.overcommit_memory=1\nsysctl -w vm.max_map_count=262144\nsysctl -w net.core.somaxconn=65535\n\n# docker network\n\nsudo ip addr show docker0\n\nLocalhost :\n172.17.0.1\nlocalhost\nhost.docker.internal\n\n"})})]})}function m(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},8453:(e,n,o)=>{o.d(n,{R:()=>s,x:()=>d});var r=o(6540);const t={},c=r.createContext(t);function s(e){const n=r.useContext(c);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),r.createElement(c.Provider,{value:n},e.children)}}}]);