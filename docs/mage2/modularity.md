# Extensibility and modularity

## Module overview
### Module components
- Themes
- Libraries
- Language packs
### Module locations
A module must include a registration.php file in its root folder.

ENTITY | LOCATION
-------|---------
Code base of your custom module	| `/app/code/<Vendor>/<Module>`
Custom theme files (storefront)	| `/app/design/frontend/<Vendor>/<theme>`
Custom theme files (modules)	| `<Module>/<theme>`
If you want to use a library	| `/lib/<Vendor_Library>`

## Modules and areas
### Area types

Area | 
-------|---------
Admin (adminhtml)| entry point for this area is pub/index.php. The Admin panel area includes the code needed for store management. The /app/design/adminhtml directory contains all the code for components you'll see while working in the Admin.
Storefront (frontend)| entry point for this area is pub/index.php. The storefront (or frontend) contains template and layout files that define the appearance of your storefront.
Basic (base)| used as a fallback for files absent in adminhtml and frontend areas.
Cron (crontab)| In pub/cron.php, the \Magento\Framework\App\Cron class always loads the 'crontab' area
Web API REST (webapi_rest)| entry point for this area is pub/index.php. The REST area has a front controller that understands how to do URL lookups for REST-based URLs.
GraphQL (graphql)| entry point for this area is pub/index.php
Web API SOAP (webapi_soap)| entry point for this area is pub/index.php.


### Note about request processing
The Commerce framework processes a URL request by first stripping off the base URL. The first path segment of the remaining URL identifies the request area.

After the area name, the URI segment specifies the frontname. When an HTTP request arrives, the Commerce framework extracts the handle from the URL and interprets it as follows:
```
[frontName]/[controller folder]/[controller class]
```

The frontName is a value defined in the module. Using catalog/product/view as an example:

- catalog is the frontName in the module area's routes.xml file
- product is in the controller folder
- view is the controller class

```
catalog/product_compare/add = Magento/Catalog/Controller/Product/Compare/Add.php
```

## Module relationships
[Docs Module relationships](https://developer.adobe.com/commerce/php/architecture/modules/relationships/)

## Module dependencies
A software dependency identifies one software component's reliance on another for proper functioning. A core principle of the Adobe Commerce and Magento Open Source framework (Commerce framework) architecture is the minimization of software dependencies. Instead of being closely interrelated with other modules, modules are optimally designed to be loosely coupled. Loosely coupled modules require little or no knowledge of other modules to perform their tasks.

[Magento docs](https://developer.adobe.com/commerce/php/architecture/modules/dependencies/)
### Dependency types
#### Hard dependencies
The `require` section of `app/code/<Vendor>/<Module>/composer.json` file contains hard dependency definitions for the module
```
  "require": {
    "magento/module-catalog": "103.0.*",
    "magento/module-email": "101.0.*",
    "magento/module-media-storage": "100.3.*",
    "magento/module-store": "101.0.*",
    "magento/module-theme": "101.0.*",
    "magento/module-ui": "101.1.*",
    "magento/module-variable": "100.3.*",
    "magento/module-widget": "101.1.*",
    "magento/module-authorization": "100.3.*"
   }
```
#### Soft dependencies
The `suggest` section of `app/code/<Vendor>/<Module>/composer.json` file contains soft dependency definitions for the module
```
  "suggest": {
    "magento/module-graph-ql": "*",
    "magento/module-graph-ql-cache": "*",
    "magento/module-store-graph-ql": "*"
  }
```
The `<sequence>` node of `app/code/<Vendor>/<Module>/etc/module.xml` file also contains soft dependency definitions for the module.
```
  <module name="Magento_Cms">
    <sequence>
      <module name="Magento_Store"/>
      <module name="Magento_Theme"/>
      <module name="Magento_Variable"/>
    </sequence>
  </module>
```
#### Managing module dependencies
- Name and declare the module in the module.xml file.
- Declare any dependencies that the module has (whether on other modules or on a different component) in the module's composer.json file.
- (Optional) Define the desired load order of config files and .css files in the module.xml file.
```
// etc/module.xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">
    <module name="Module_A" setup_version="1.0.0">
        <sequence>
            <module name="Module_B" />
        </sequence>
    </module>
</config>

// app/etc/config.php
return [
    'modules' => [
        ...
        'Module_B' => 1,
        'Module_A' => 1,
        ...
    ]
];
```