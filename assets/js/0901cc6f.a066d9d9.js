"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9537],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},b=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),b=c(r),d=a,m=b["".concat(l,".").concat(d)]||b[d]||p[d]||i;return r?n.createElement(m,s(s({ref:t},u),{},{components:r})):n.createElement(m,s({ref:t},u))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,s=new Array(i);s[0]=b;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:a,s[1]=o;for(var c=2;c<i;c++)s[c]=r[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}b.displayName="MDXCreateElement"},7255:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>p,frontMatter:()=>i,metadata:()=>o,toc:()=>c});var n=r(7462),a=(r(7294),r(3905));const i={},s="Globbing in Linux",o={unversionedId:"server/bash/glob",id:"server/bash/glob",title:"Globbing in Linux",description:"Globbing involves expanding a wildcard pattern such as * or ? into a list of pathnames that match a pattern.",source:"@site/docs/server/bash/glob.md",sourceDirName:"server/bash",slug:"/server/bash/glob",permalink:"/docs/server/bash/glob",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Basic file management",permalink:"/docs/server/bash/file-management"},next:{title:"grep",permalink:"/docs/server/bash/grep"}},l={},c=[{value:"Asterisks (*).",id:"asterisks-",level:2},{value:"Question mark (?).",id:"question-mark-",level:2},{value:"Square brackets.",id:"square-brackets",level:2},{value:"Caret(^).",id:"caret",level:2},{value:"Exclamation(!).",id:"exclamation",level:2},{value:"Dollar sign($).",id:"dollar-sign",level:2},{value:"Curly brackets {}.",id:"curly-brackets-",level:2},{value:"Pipes(|).",id:"pipes",level:2}],u={toc:c};function p(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"globbing-in-linux"},"Globbing in Linux"),(0,a.kt)("p",null,"Globbing involves expanding a wildcard pattern such as * or ? into a list of pathnames that match a pattern.",(0,a.kt)("br",{parentName:"p"}),"\n","We use globbing with various commands such as rm, find, grep, ls, cat, cp to achieve a more desired result while executing these commands.",(0,a.kt)("br",{parentName:"p"}),"\n","Globbing is very useful in cases where we have scripts that interact with user input. A user's input might be vague and so we have to have measures that handle such cases. For example, if we expect the input to be a Yes, YES, Y we can use the asterisk glob to handle this."),(0,a.kt)("h2",{id:"asterisks-"},"Asterisks (*)."),(0,a.kt)("h2",{id:"question-mark-"},"Question mark (?)."),(0,a.kt)("h2",{id:"square-brackets"},"Square brackets."),(0,a.kt)("h2",{id:"caret"},"Caret(^)."),(0,a.kt)("h2",{id:"exclamation"},"Exclamation(!)."),(0,a.kt)("h2",{id:"dollar-sign"},"Dollar sign($)."),(0,a.kt)("h2",{id:"curly-brackets-"},"Curly brackets {}."),(0,a.kt)("h2",{id:"pipes"},"Pipes(|)."))}p.isMDXComponent=!0}}]);