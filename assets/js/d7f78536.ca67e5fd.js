"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[8162],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),s=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),m=s(r),f=a,y=m["".concat(l,".").concat(f)]||m[f]||u[f]||o;return r?n.createElement(y,i(i({ref:t},p),{},{components:r})):n.createElement(y,i({ref:t},p))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var s=2;s<o;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},1617:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>c,toc:()=>s});var n=r(7462),a=(r(7294),r(3905));const o={},i="Caching layer for Magento services",c={unversionedId:"mage2/caching-layer",id:"mage2/caching-layer",title:"Caching layer for Magento services",description:"Cache is one of the most important parts in a modern web application architecture. Magento caching layer should effectively improve:",source:"@site/docs/mage2/caching-layer.md",sourceDirName:"mage2",slug:"/mage2/caching-layer",permalink:"/docs/mage2/caching-layer",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Authorization",permalink:"/docs/mage2/authorization"},next:{title:"collect-totals",permalink:"/docs/mage2/collect-totals"}},l={},s=[],p={toc:s};function u(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"caching-layer-for-magento-services"},"Caching layer for Magento services"),(0,a.kt)("p",null,"Cache is one of the most important parts in a modern web application architecture. Magento caching layer should effectively improve:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Performance"),(0,a.kt)("li",{parentName:"ul"},"Availability"),(0,a.kt)("li",{parentName:"ul"},"Scalability")),(0,a.kt)("p",null,"Caching should be implemented on several levels:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Caching of http-responses returned by BFF (Backend for Frontend)"),(0,a.kt)("li",{parentName:"ul"},"Application data caching (results of DB queries, merged configurations etc.)")),(0,a.kt)("p",null,"BFF http-responses contains static assets, public and private dynamic content. Static assets should be cached using CDN. Reverse proxy should cache public content. It could be Varnish (acts as reverse proxy) or Fastly (combines reverse proxy and CDN functions). Varnish and Fastly are already integrated with Magento. Reverse proxy uses lazy caching approach. Beside performance this type of cache has next benefits"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Protection against outages - can optionally serve stale content when there is a problem with origin server"),(0,a.kt)("li",{parentName:"ul"},"Scalability - number of caching nodes can be increased"),(0,a.kt)("li",{parentName:"ul"},"Flexibility \u2013 Varnish Configuration Language (VCL) builds customized solutions, rules and modules")))}u.isMDXComponent=!0}}]);