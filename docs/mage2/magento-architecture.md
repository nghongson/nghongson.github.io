---
sidebar_position: 2
---
# Magento Architecture

Magento Open Source framework incorporates the core architectural principles of object-oriented, PHP-based applications.
- [System requirements](https://devdocs.magento.com/guides/v2.4/install-gde/system-requirements.html)
- [Layers diagram](https://developer.adobe.com/commerce/php/architecture/basics/diagrams/)
- [Modules and Extensibility](https://developer.adobe.com/commerce/php/architecture/modules/)
- [Coding standards](https://developer.adobe.com/commerce/php/coding-standards/)
- [Commerce framework](https://developer.adobe.com/commerce/php/architecture/framework/)
- [Event-driven architecture](https://developer.adobe.com/commerce/php/development/components/events-and-observers/)
- [Security](https://developer.adobe.com/commerce/php/architecture/basics/security/)

## Architecture layers diagram
![Architecture Overview](/img/m2/archi_diagram_desired-state.webp)
Magento build use layered software:
- Presentation Layer
- Service layer
- Domain layer
- Persistence layer
![Magento Layers](/img/m2/mage2-layers.png)

### Presentation layer
When you interact with the Magento web interface, you are interacting with presentation layer code  
The presentation layer contains both view elements (layouts, blocks, templates) and controllers, which process commands to and from the user interface.
Three types of Magento users interact with presentation layer code:  
- Web users interact with the storefront
- System administrators customise a storefront
- Web API calls can be made through HTTP just like browser requests, and can be made via AJAX calls from the user interface.

### Service layer
The service layer provides a bridge between the presentation layer and the domain layer and resource-specific data. This is implemented using service contracts, which are defined using PHP interfaces.  
In general, the service layer:
- Resides below the presentation layer and above the domain layer.
- Contains service contracts, which define how the implementation will behave.
- Provides an easy way to access the REST/SOAP API framework code 
- Provides a stable API for other modules to call into

Service contract clients include:
- Controllers
- Web services (SOAP and REST API)
- Other Magento modules through service contracts

Service contracts provide three distinct types of interfaces:
- Repository interfaces
- Management interfaces
- Metadata interfaces

Defined by the set of interfaces in the module’s /Api directory.
- Service interfaces in the /Api
- Data (or entity) interfaces in the Api/Data 

### Domain layer
The domain layer holds the business logic layer of a `module`. It typically does not contain resource-specific or database-specific information. Its primary functions include:
- Defining the generic data objects, or models, that contain business logic.
This logic defines which operations can be performed on particular types of data, such as a Customer object. 
These models contain generic information only. Applications can also use SOAP or RESTful endpoints to request data from models.
- (Optionally) Including the implementation of service contracts, although not their definition.
#### Models
Each domain-layer model contains a reference to a resource model, which it uses to retrieve data from the database with MySql calls. This resource model contains logic for connecting to the underlying database, typically MySQL. A model requires a resource model only if the model data must persist.
#### Accessing the domain layer
There are three primary ways of accessing a module's domain-layer code:
- Service contracts are the recommended way for one module to access another module's domain-level code.
- A module can directly call into another module. (not recommended for most situations, but is sometimes unavoidable)
- Plug itself into another module by:  
  - event hooks
  - plugins
  - di.xml files (with an SPI contract)

### Persistence layer
Magento uses an active record pattern strategy for persistence. In this system, the model object contains a resource model that maps an object to one or more database rows.

- Executing all CRUD (create, read, update, delete) requests
- Performing additional business logic. For example, a resource model could perform data validation, start processes before or after data is saved, or perform other database operations.

#### Models
- A simple resource model defines and interacts with a single table.  
- However, some objects have a vast number of attributes, or they could have a set related objects that have varying numbers of attributes. In these cases, the objects are constructed using Entity-Attribute-Value (EAV) models.  
Any model that uses an EAV resource has its attributes spread out over a number of MySQL tables.  
- The Customer, Catalog and Order resource models use EAV attributes.  
#### [XML Declarative schema](https://developer.adobe.com/commerce/php/development/components/declarative-schema/)

## Modularity & Extensibility
Extensibility describes the product's built-in ability for developers and merchants to routinely extend their storefront's capabilities as their business grows.  
### The factors affect extensibility.
- Architectural principles that guide product structure
- Reliance on popular design patterns
- Modularity
- Rich product ecosystem
- Open-source software to create and manage extensions
- Coding standards
- Upgrade and versioning strategies
- Web APIs
- Flexible attribute types
  - EAV (Entity-Attribute-Value) attributes
  - Custom attributes
  - Extension attributes
- Service contracts, dependency injection, and dependency inversion
- Plugins
