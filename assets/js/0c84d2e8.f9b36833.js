"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7670],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),s=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=s(e.components);return n.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=s(r),d=a,f=m["".concat(c,".").concat(d)]||m[d]||u[d]||i;return r?n.createElement(f,o(o({ref:t},p),{},{components:r})):n.createElement(f,o({ref:t},p))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var s=2;s<i;s++)o[s]=r[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8416:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var n=r(7462),a=(r(7294),r(3905));const i={},o="The Twelve Factors",l={unversionedId:"architect/12factors",id:"architect/12factors",title:"The Twelve Factors",description:"The twelve-factor app is a methodology for building software-as-a-service apps that:",source:"@site/docs/architect/12factors.md",sourceDirName:"architect",slug:"/architect/12factors",permalink:"/docs/architect/12factors",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Refactoring",permalink:"/docs/architect/refactoring"},next:{title:"K.I.S.S Principle",permalink:"/docs/architect/KISS"}},c={},s=[],p={toc:s};function u(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"the-twelve-factors"},"The Twelve Factors"),(0,a.kt)("p",null,"The twelve-factor app is a methodology for building software-as-a-service apps that:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Use declarative formats for setup automation, to minimize time and cost for new developers joining the project;"),(0,a.kt)("li",{parentName:"ul"},"Have a clean contract with the underlying operating system, offering maximum portability between execution environments;"),(0,a.kt)("li",{parentName:"ul"},"Are suitable for deployment on modern cloud platforms, obviating the need for servers and systems administration;"),(0,a.kt)("li",{parentName:"ul"},"Minimize divergence between development and production, enabling continuous deployment for maximum agility;"),(0,a.kt)("li",{parentName:"ul"},"And can scale up without significant changes to tooling, architecture, or development practices.")),(0,a.kt)("p",null,"The twelve-factor methodology can be applied to apps written in any programming language, and which use any combination of backing services (database, queue, memory cache, etc)."),(0,a.kt)("p",null,"##########"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"I. Codebase",(0,a.kt)("br",{parentName:"li"}),"One codebase tracked in revision control, many deploys\n(git repository)"),(0,a.kt)("li",{parentName:"ul"},"II. Dependencies",(0,a.kt)("br",{parentName:"li"}),"Explicitly declare and isolate dependencies\n(composer, npm ...)"),(0,a.kt)("li",{parentName:"ul"},"III. Config",(0,a.kt)("br",{parentName:"li"}),"Store config in the environment\n(env, .env, env.php)"),(0,a.kt)("li",{parentName:"ul"},"IV. Backing services",(0,a.kt)("br",{parentName:"li"}),"Treat backing services as attached resources\n(mysql, s3 ...)"),(0,a.kt)("li",{parentName:"ul"},"V. Build, release, run",(0,a.kt)("br",{parentName:"li"}),"Strictly separate build and run stages\n(deploys)"),(0,a.kt)("li",{parentName:"ul"},"VI. Processes",(0,a.kt)("br",{parentName:"li"}),"Execute the app as one or more stateless processes"),(0,a.kt)("li",{parentName:"ul"},"VII. Port binding",(0,a.kt)("br",{parentName:"li"}),"Export services via port binding\n(ports : 80, 443, 3000)"),(0,a.kt)("li",{parentName:"ul"},"VIII. Concurrency",(0,a.kt)("br",{parentName:"li"}),"Scale out via the process model"),(0,a.kt)("li",{parentName:"ul"},"IX. Disposability",(0,a.kt)("br",{parentName:"li"}),"Maximize robustness with fast startup and graceful shutdown"),(0,a.kt)("li",{parentName:"ul"},"X. Dev/prod parity",(0,a.kt)("br",{parentName:"li"}),"Keep development, staging, and production as similar as possible"),(0,a.kt)("li",{parentName:"ul"},"XI. Logs",(0,a.kt)("br",{parentName:"li"}),"Treat logs as event streams\n(logging error, warning, debug, ...)"),(0,a.kt)("li",{parentName:"ul"},"XII. Admin processes",(0,a.kt)("br",{parentName:"li"}),"Run admin/management tasks as one-off processes")))}u.isMDXComponent=!0}}]);