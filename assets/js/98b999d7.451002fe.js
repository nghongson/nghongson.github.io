"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[1880],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>p});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var s=r.createContext({}),c=function(e){var t=r.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},u=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,s=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),d=c(a),p=n,h=d["".concat(s,".").concat(p)]||d[p]||m[p]||i;return a?r.createElement(h,l(l({ref:t},u),{},{components:a})):r.createElement(h,l({ref:t},u))}));function p(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,l=new Array(i);l[0]=d;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:n,l[1]=o;for(var c=2;c<i;c++)l[c]=a[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,a)}d.displayName="MDXCreateElement"},5639:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>m,frontMatter:()=>i,metadata:()=>o,toc:()=>c});var r=a(7462),n=(a(7294),a(3905));const i={sidebar_position:2},l="Magento Architecture",o={unversionedId:"mage2/magento-architecture",id:"mage2/magento-architecture",title:"Magento Architecture",description:"Magento Open Source framework incorporates the core architectural principles of object-oriented, PHP-based applications.",source:"@site/docs/mage2/magento-architecture.md",sourceDirName:"mage2",slug:"/mage2/magento-architecture",permalink:"/docs/mage2/magento-architecture",draft:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Documents references",permalink:"/docs/mage2/documents-references"},next:{title:"Describe Magento\u2019s module-based architecture",permalink:"/docs/mage2/module-architecture"}},s={},c=[{value:"Architecture layers diagram",id:"architecture-layers-diagram",level:2},{value:"Presentation layer",id:"presentation-layer",level:3},{value:"Service layer",id:"service-layer",level:3},{value:"Domain layer",id:"domain-layer",level:3},{value:"Models",id:"models",level:4},{value:"Accessing the domain layer",id:"accessing-the-domain-layer",level:4},{value:"Persistence layer",id:"persistence-layer",level:3},{value:"Models",id:"models-1",level:4},{value:"XML Declarative schema",id:"xml-declarative-schema",level:4},{value:"Modularity &amp; Extensibility",id:"modularity--extensibility",level:2},{value:"The factors affect extensibility.",id:"the-factors-affect-extensibility",level:3}],u={toc:c};function m(e){let{components:t,...i}=e;return(0,n.kt)("wrapper",(0,r.Z)({},u,i,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"magento-architecture"},"Magento Architecture"),(0,n.kt)("p",null,"Magento Open Source framework incorporates the core architectural principles of object-oriented, PHP-based applications."),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://devdocs.magento.com/guides/v2.4/install-gde/system-requirements.html"},"System requirements")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://developer.adobe.com/commerce/php/architecture/basics/diagrams/"},"Layers diagram")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://developer.adobe.com/commerce/php/architecture/modules/"},"Modules and Extensibility")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://developer.adobe.com/commerce/php/coding-standards/"},"Coding standards")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://developer.adobe.com/commerce/php/architecture/framework/"},"Commerce framework")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://developer.adobe.com/commerce/php/development/components/events-and-observers/"},"Event-driven architecture")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://developer.adobe.com/commerce/php/architecture/basics/security/"},"Security"))),(0,n.kt)("h2",{id:"architecture-layers-diagram"},"Architecture layers diagram"),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"Architecture Overview",src:a(8783).Z,width:"960",height:"540"}),"\nMagento build use layered software:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Presentation Layer"),(0,n.kt)("li",{parentName:"ul"},"Service layer"),(0,n.kt)("li",{parentName:"ul"},"Domain layer"),(0,n.kt)("li",{parentName:"ul"},"Persistence layer\n",(0,n.kt)("img",{alt:"Magento Layers",src:a(3872).Z,width:"720",height:"540"}))),(0,n.kt)("h3",{id:"presentation-layer"},"Presentation layer"),(0,n.kt)("p",null,"When you interact with the Magento web interface, you are interacting with presentation layer code",(0,n.kt)("br",{parentName:"p"}),"\n","The presentation layer contains both view elements (layouts, blocks, templates) and controllers, which process commands to and from the user interface.\nThree types of Magento users interact with presentation layer code:  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Web users interact with the storefront"),(0,n.kt)("li",{parentName:"ul"},"System administrators customise a storefront"),(0,n.kt)("li",{parentName:"ul"},"Web API calls can be made through HTTP just like browser requests, and can be made via AJAX calls from the user interface.")),(0,n.kt)("h3",{id:"service-layer"},"Service layer"),(0,n.kt)("p",null,"The service layer provides a bridge between the presentation layer and the domain layer and resource-specific data. This is implemented using service contracts, which are defined using PHP interfaces.",(0,n.kt)("br",{parentName:"p"}),"\n","In general, the service layer:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Resides below the presentation layer and above the domain layer."),(0,n.kt)("li",{parentName:"ul"},"Contains service contracts, which define how the implementation will behave."),(0,n.kt)("li",{parentName:"ul"},"Provides an easy way to access the REST/SOAP API framework code "),(0,n.kt)("li",{parentName:"ul"},"Provides a stable API for other modules to call into")),(0,n.kt)("p",null,"Service contract clients include:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Controllers"),(0,n.kt)("li",{parentName:"ul"},"Web services (SOAP and REST API)"),(0,n.kt)("li",{parentName:"ul"},"Other Magento modules through service contracts")),(0,n.kt)("p",null,"Service contracts provide three distinct types of interfaces:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Repository interfaces"),(0,n.kt)("li",{parentName:"ul"},"Management interfaces"),(0,n.kt)("li",{parentName:"ul"},"Metadata interfaces")),(0,n.kt)("p",null,"Defined by the set of interfaces in the module\u2019s /Api directory."),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Service interfaces in the /Api"),(0,n.kt)("li",{parentName:"ul"},"Data (or entity) interfaces in the Api/Data ")),(0,n.kt)("h3",{id:"domain-layer"},"Domain layer"),(0,n.kt)("p",null,"The domain layer holds the business logic layer of a ",(0,n.kt)("inlineCode",{parentName:"p"},"module"),". It typically does not contain resource-specific or database-specific information. Its primary functions include:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Defining the generic data objects, or models, that contain business logic.\nThis logic defines which operations can be performed on particular types of data, such as a Customer object.\nThese models contain generic information only. Applications can also use SOAP or RESTful endpoints to request data from models."),(0,n.kt)("li",{parentName:"ul"},"(Optionally) Including the implementation of service contracts, although not their definition.")),(0,n.kt)("h4",{id:"models"},"Models"),(0,n.kt)("p",null,"Each domain-layer model contains a reference to a resource model, which it uses to retrieve data from the database with MySql calls. This resource model contains logic for connecting to the underlying database, typically MySQL. A model requires a resource model only if the model data must persist."),(0,n.kt)("h4",{id:"accessing-the-domain-layer"},"Accessing the domain layer"),(0,n.kt)("p",null,"There are three primary ways of accessing a module's domain-layer code:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Service contracts are the recommended way for one module to access another module's domain-level code."),(0,n.kt)("li",{parentName:"ul"},"A module can directly call into another module. (not recommended for most situations, but is sometimes unavoidable)"),(0,n.kt)("li",{parentName:"ul"},"Plug itself into another module by:  ",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"event hooks"),(0,n.kt)("li",{parentName:"ul"},"plugins"),(0,n.kt)("li",{parentName:"ul"},"di.xml files (with an SPI contract)")))),(0,n.kt)("h3",{id:"persistence-layer"},"Persistence layer"),(0,n.kt)("p",null,"Magento uses an active record pattern strategy for persistence. In this system, the model object contains a resource model that maps an object to one or more database rows."),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Executing all CRUD (create, read, update, delete) requests"),(0,n.kt)("li",{parentName:"ul"},"Performing additional business logic. For example, a resource model could perform data validation, start processes before or after data is saved, or perform other database operations.")),(0,n.kt)("h4",{id:"models-1"},"Models"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"A simple resource model defines and interacts with a single table.  "),(0,n.kt)("li",{parentName:"ul"},"However, some objects have a vast number of attributes, or they could have a set related objects that have varying numbers of attributes. In these cases, the objects are constructed using Entity-Attribute-Value (EAV) models.",(0,n.kt)("br",{parentName:"li"}),"Any model that uses an EAV resource has its attributes spread out over a number of MySQL tables.  "),(0,n.kt)("li",{parentName:"ul"},"The Customer, Catalog and Order resource models use EAV attributes.  ")),(0,n.kt)("h4",{id:"xml-declarative-schema"},(0,n.kt)("a",{parentName:"h4",href:"https://developer.adobe.com/commerce/php/development/components/declarative-schema/"},"XML Declarative schema")),(0,n.kt)("h2",{id:"modularity--extensibility"},"Modularity & Extensibility"),(0,n.kt)("p",null,"Extensibility describes the product's built-in ability for developers and merchants to routinely extend their storefront's capabilities as their business grows.  "),(0,n.kt)("h3",{id:"the-factors-affect-extensibility"},"The factors affect extensibility."),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Architectural principles that guide product structure"),(0,n.kt)("li",{parentName:"ul"},"Reliance on popular design patterns"),(0,n.kt)("li",{parentName:"ul"},"Modularity"),(0,n.kt)("li",{parentName:"ul"},"Rich product ecosystem"),(0,n.kt)("li",{parentName:"ul"},"Open-source software to create and manage extensions"),(0,n.kt)("li",{parentName:"ul"},"Coding standards"),(0,n.kt)("li",{parentName:"ul"},"Upgrade and versioning strategies"),(0,n.kt)("li",{parentName:"ul"},"Web APIs"),(0,n.kt)("li",{parentName:"ul"},"Flexible attribute types",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"EAV (Entity-Attribute-Value) attributes"),(0,n.kt)("li",{parentName:"ul"},"Custom attributes"),(0,n.kt)("li",{parentName:"ul"},"Extension attributes"))),(0,n.kt)("li",{parentName:"ul"},"Service contracts, dependency injection, and dependency inversion"),(0,n.kt)("li",{parentName:"ul"},"Plugins")))}m.isMDXComponent=!0},8783:(e,t,a)=>{a.d(t,{Z:()=>r});const r=a.p+"assets/images/archi_diagram_desired-state-9d76d70ac1c5340819307ddecc30faea.webp"},3872:(e,t,a)=>{a.d(t,{Z:()=>r});const r=a.p+"assets/images/mage2-layers-b4fac4a551d8830fe248c1d8bfa1a21f.png"}}]);