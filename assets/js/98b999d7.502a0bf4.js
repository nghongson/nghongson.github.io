"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4850],{9598:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>s,metadata:()=>c,toc:()=>o});var r=i(4848),t=i(8453);const s={sidebar_position:2},a="Magento Architecture",c={id:"mage2/magento-architecture",title:"Magento Architecture",description:"Magento Open Source framework incorporates the core architectural principles of object-oriented, PHP-based applications.",source:"@site/docs/mage2/magento-architecture.md",sourceDirName:"mage2",slug:"/mage2/magento-architecture",permalink:"/docs/mage2/magento-architecture",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Documents references",permalink:"/docs/mage2/documents-references"},next:{title:"Describe Magento\u2019s module-based architecture",permalink:"/docs/mage2/module-architecture"}},l={},o=[{value:"Architecture layers diagram",id:"Architecture-layers-diagram",level:2},{value:"Presentation layer",id:"Presentation-layer",level:3},{value:"Service layer",id:"Service-layer",level:3},{value:"Domain layer",id:"Domain-layer",level:3},{value:"Models",id:"Models",level:4},{value:"Accessing the domain layer",id:"Accessing-the-domain-layer",level:4},{value:"Persistence layer",id:"Persistence-layer",level:3},{value:"Models",id:"Models-1",level:4},{value:"XML Declarative schema",id:"XML-Declarative-schema",level:4},{value:"Modularity &amp; Extensibility",id:"Modularity--Extensibility",level:2},{value:"The factors affect extensibility.",id:"The-factors-affect-extensibility",level:3}];function d(e){const n={a:"a",br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"Magento-Architecture",children:"Magento Architecture"}),"\n",(0,r.jsx)(n.p,{children:"Magento Open Source framework incorporates the core architectural principles of object-oriented, PHP-based applications."}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://devdocs.magento.com/guides/v2.4/install-gde/system-requirements.html",children:"System requirements"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://developer.adobe.com/commerce/php/architecture/basics/diagrams/",children:"Layers diagram"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://developer.adobe.com/commerce/php/architecture/modules/",children:"Modules and Extensibility"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://developer.adobe.com/commerce/php/coding-standards/",children:"Coding standards"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://developer.adobe.com/commerce/php/architecture/framework/",children:"Commerce framework"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://developer.adobe.com/commerce/php/development/components/events-and-observers/",children:"Event-driven architecture"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://developer.adobe.com/commerce/php/architecture/basics/security/",children:"Security"})}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"Architecture-layers-diagram",children:"Architecture layers diagram"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.img,{alt:"Architecture Overview",src:i(2630).A+"",width:"960",height:"540"}),"\nMagento build use layered software:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Presentation Layer"}),"\n",(0,r.jsx)(n.li,{children:"Service layer"}),"\n",(0,r.jsx)(n.li,{children:"Domain layer"}),"\n",(0,r.jsxs)(n.li,{children:["Persistence layer\n",(0,r.jsx)(n.img,{alt:"Magento Layers",src:i(1566).A+"",width:"720",height:"540"})]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"Presentation-layer",children:"Presentation layer"}),"\n",(0,r.jsxs)(n.p,{children:["When you interact with the Magento web interface, you are interacting with presentation layer code",(0,r.jsx)(n.br,{}),"\n","The presentation layer contains both view elements (layouts, blocks, templates) and controllers, which process commands to and from the user interface.\nThree types of Magento users interact with presentation layer code:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Web users interact with the storefront"}),"\n",(0,r.jsx)(n.li,{children:"System administrators customise a storefront"}),"\n",(0,r.jsx)(n.li,{children:"Web API calls can be made through HTTP just like browser requests, and can be made via AJAX calls from the user interface."}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"Service-layer",children:"Service layer"}),"\n",(0,r.jsxs)(n.p,{children:["The service layer provides a bridge between the presentation layer and the domain layer and resource-specific data. This is implemented using service contracts, which are defined using PHP interfaces.",(0,r.jsx)(n.br,{}),"\n","In general, the service layer:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Resides below the presentation layer and above the domain layer."}),"\n",(0,r.jsx)(n.li,{children:"Contains service contracts, which define how the implementation will behave."}),"\n",(0,r.jsx)(n.li,{children:"Provides an easy way to access the REST/SOAP API framework code"}),"\n",(0,r.jsx)(n.li,{children:"Provides a stable API for other modules to call into"}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Service contract clients include:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Controllers"}),"\n",(0,r.jsx)(n.li,{children:"Web services (SOAP and REST API)"}),"\n",(0,r.jsx)(n.li,{children:"Other Magento modules through service contracts"}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Service contracts provide three distinct types of interfaces:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Repository interfaces"}),"\n",(0,r.jsx)(n.li,{children:"Management interfaces"}),"\n",(0,r.jsx)(n.li,{children:"Metadata interfaces"}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Defined by the set of interfaces in the module\u2019s /Api directory."}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Service interfaces in the /Api"}),"\n",(0,r.jsx)(n.li,{children:"Data (or entity) interfaces in the Api/Data"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"Domain-layer",children:"Domain layer"}),"\n",(0,r.jsxs)(n.p,{children:["The domain layer holds the business logic layer of a ",(0,r.jsx)(n.code,{children:"module"}),". It typically does not contain resource-specific or database-specific information. Its primary functions include:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Defining the generic data objects, or models, that contain business logic.\nThis logic defines which operations can be performed on particular types of data, such as a Customer object.\nThese models contain generic information only. Applications can also use SOAP or RESTful endpoints to request data from models."}),"\n",(0,r.jsx)(n.li,{children:"(Optionally) Including the implementation of service contracts, although not their definition."}),"\n"]}),"\n",(0,r.jsx)(n.h4,{id:"Models",children:"Models"}),"\n",(0,r.jsx)(n.p,{children:"Each domain-layer model contains a reference to a resource model, which it uses to retrieve data from the database with MySql calls. This resource model contains logic for connecting to the underlying database, typically MySQL. A model requires a resource model only if the model data must persist."}),"\n",(0,r.jsx)(n.h4,{id:"Accessing-the-domain-layer",children:"Accessing the domain layer"}),"\n",(0,r.jsx)(n.p,{children:"There are three primary ways of accessing a module's domain-layer code:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Service contracts are the recommended way for one module to access another module's domain-level code."}),"\n",(0,r.jsx)(n.li,{children:"A module can directly call into another module. (not recommended for most situations, but is sometimes unavoidable)"}),"\n",(0,r.jsxs)(n.li,{children:["Plug itself into another module by:","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"event hooks"}),"\n",(0,r.jsx)(n.li,{children:"plugins"}),"\n",(0,r.jsx)(n.li,{children:"di.xml files (with an SPI contract)"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"Persistence-layer",children:"Persistence layer"}),"\n",(0,r.jsx)(n.p,{children:"Magento uses an active record pattern strategy for persistence. In this system, the model object contains a resource model that maps an object to one or more database rows."}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Executing all CRUD (create, read, update, delete) requests"}),"\n",(0,r.jsx)(n.li,{children:"Performing additional business logic. For example, a resource model could perform data validation, start processes before or after data is saved, or perform other database operations."}),"\n"]}),"\n",(0,r.jsx)(n.h4,{id:"Models-1",children:"Models"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"A simple resource model defines and interacts with a single table."}),"\n",(0,r.jsxs)(n.li,{children:["However, some objects have a vast number of attributes, or they could have a set related objects that have varying numbers of attributes. In these cases, the objects are constructed using Entity-Attribute-Value (EAV) models.",(0,r.jsx)(n.br,{}),"\n","Any model that uses an EAV resource has its attributes spread out over a number of MySQL tables."]}),"\n",(0,r.jsx)(n.li,{children:"The Customer, Catalog and Order resource models use EAV attributes."}),"\n"]}),"\n",(0,r.jsx)(n.h4,{id:"XML-Declarative-schema",children:(0,r.jsx)(n.a,{href:"https://developer.adobe.com/commerce/php/development/components/declarative-schema/",children:"XML Declarative schema"})}),"\n",(0,r.jsx)(n.h2,{id:"Modularity--Extensibility",children:"Modularity & Extensibility"}),"\n",(0,r.jsx)(n.p,{children:"Extensibility describes the product's built-in ability for developers and merchants to routinely extend their storefront's capabilities as their business grows."}),"\n",(0,r.jsx)(n.h3,{id:"The-factors-affect-extensibility",children:"The factors affect extensibility."}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Architectural principles that guide product structure"}),"\n",(0,r.jsx)(n.li,{children:"Reliance on popular design patterns"}),"\n",(0,r.jsx)(n.li,{children:"Modularity"}),"\n",(0,r.jsx)(n.li,{children:"Rich product ecosystem"}),"\n",(0,r.jsx)(n.li,{children:"Open-source software to create and manage extensions"}),"\n",(0,r.jsx)(n.li,{children:"Coding standards"}),"\n",(0,r.jsx)(n.li,{children:"Upgrade and versioning strategies"}),"\n",(0,r.jsx)(n.li,{children:"Web APIs"}),"\n",(0,r.jsxs)(n.li,{children:["Flexible attribute types","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"EAV (Entity-Attribute-Value) attributes"}),"\n",(0,r.jsx)(n.li,{children:"Custom attributes"}),"\n",(0,r.jsx)(n.li,{children:"Extension attributes"}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.li,{children:"Service contracts, dependency injection, and dependency inversion"}),"\n",(0,r.jsx)(n.li,{children:"Plugins"}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},2630:(e,n,i)=>{i.d(n,{A:()=>r});const r=i.p+"assets/images/archi_diagram_desired-state-9d76d70ac1c5340819307ddecc30faea.webp"},1566:(e,n,i)=>{i.d(n,{A:()=>r});const r=i.p+"assets/images/mage2-layers-b4fac4a551d8830fe248c1d8bfa1a21f.png"},8453:(e,n,i)=>{i.d(n,{R:()=>a,x:()=>c});var r=i(6540);const t={},s=r.createContext(t);function a(e){const n=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),r.createElement(s.Provider,{value:n},e.children)}}}]);