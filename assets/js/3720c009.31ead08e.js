"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4787],{2194:(t,e,a)=>{a.r(e),a.d(e,{default:()=>d});a(6540);var s=a(4164),r=a(1213),l=a(7559),n=a(6820),c=a(2557),i=a(1463),g=a(1107),o=a(4848);function u(t){let{title:e}=t;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r.be,{title:e}),(0,o.jsx)(i.A,{tag:"doc_tags_list"})]})}function h(t){let{tags:e,title:a}=t;return(0,o.jsx)(r.e3,{className:(0,s.A)(l.G.page.docsTagsListPage),children:(0,o.jsx)("div",{className:"container margin-vert--lg",children:(0,o.jsx)("div",{className:"row",children:(0,o.jsxs)("main",{className:"col col--8 col--offset-2",children:[(0,o.jsx)(g.A,{as:"h1",children:a}),(0,o.jsx)(c.A,{tags:e})]})})})})}function d(t){const e=(0,n.b)();return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(u,{...t,title:e}),(0,o.jsx)(h,{...t,title:e})]})}},6133:(t,e,a)=>{a.d(e,{A:()=>c});a(6540);var s=a(4164),r=a(8774);const l={tag:"tag_zVej",tagRegular:"tagRegular_sFm0",tagWithCount:"tagWithCount_h2kH"};var n=a(4848);function c(t){let{permalink:e,label:a,count:c}=t;return(0,n.jsxs)(r.A,{href:e,className:(0,s.A)(l.tag,c?l.tagWithCount:l.tagRegular),children:[a,c&&(0,n.jsx)("span",{children:c})]})}},2557:(t,e,a)=>{a.d(e,{A:()=>g});a(6540);var s=a(6820),r=a(6133),l=a(1107);const n={tag:"tag_Nnez"};var c=a(4848);function i(t){let{letterEntry:e}=t;return(0,c.jsxs)("article",{children:[(0,c.jsx)(l.A,{as:"h2",id:e.letter,children:e.letter}),(0,c.jsx)("ul",{className:"padding--none",children:e.tags.map((t=>(0,c.jsx)("li",{className:n.tag,children:(0,c.jsx)(r.A,{...t})},t.permalink)))}),(0,c.jsx)("hr",{})]})}function g(t){let{tags:e}=t;const a=(0,s.Q)(e);return(0,c.jsx)("section",{className:"margin-vert--lg",children:a.map((t=>(0,c.jsx)(i,{letterEntry:t},t.letter)))})}},6820:(t,e,a)=>{a.d(e,{Q:()=>l,b:()=>r});var s=a(1312);const r=()=>(0,s.T)({id:"theme.tags.tagsPageTitle",message:"Tags",description:"The title of the tag list page"});function l(t){const e={};return Object.values(t).forEach((t=>{const a=function(t){return t[0].toUpperCase()}(t.label);e[a]??=[],e[a].push(t)})),Object.entries(e).sort(((t,e)=>{let[a]=t,[s]=e;return a.localeCompare(s)})).map((t=>{let[e,a]=t;return{letter:e,tags:a.sort(((t,e)=>t.label.localeCompare(e.label)))}}))}}}]);