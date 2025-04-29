---
sidebar_position: 6
---
# Routing

## FrontController classes

* FrontController: Magento\Framework\App\FrontController

The FrontController class class searches through a list of routers, provided by the RouterList class, until it matches one that can process a request. When the FrontController finds a matching router, it dispatches the request to an action class returned by the router.

* RouterList: Magento\Framework\App\RouterList

The RouterList class collection of routers

* Router class: 

The Router class matches a request to an action class that processes the request.
Implement Magento\Framework\App\RouterInterface

`frontend` area routers:

Router | Order | Class | Description
-------|-------|-------|------
robots | 10 | Magento\Robots\Controller\Route | Matches request to the robots.txt file
urlrewrite | 20 | Magento\UrlRewrite\Controller\Route | Matches requests with URL defined in the database
standard | 30 |  Magento\Framework\App\Router\Base | The standard router
cms | 60 | Magento\Cms\Controller\Route | Matches requests for CMS pages
default | 100 | Magento\Framework\App\Router\DefaultRoute | The default router : set to no-route action

`admin` area routers:

Router | Order | Class | Description
-------|-------|-------|------
admin | 10 | Magento\Backend\App\Route | Matches requests in the Admin area
default | 100 | Magento\Framework\App\Router\DefaultRouter | The default router for the Admin area

### Standard router
A URL that uses the standard router has the following format:
```
<store-url>/<store-code>/<front-name>/<controller-name>/<action-name>
Where:

* <store-url> - specifies the base URL for the application instance
* <store-code> - specifies the store context
* <front-name> - specifies the frontName of the FrontController to use (for example, [routesxml])
* <controller-name> - specifies the name of the controller
* <action-name> - specifies the action class to execute on the controller class
```

### Custom routers
Create an implementation of `RouterInterface` to create a custom router, and define the match() function in this class to use your own route matching logic.

If you need route configuration data, use the Route Config class.

To add your custom router to the list of routers for the `FrontController`, add the following entry in your module's `frontend/di.xml` file:

```frontend/di.xml
<type name="Magento\Framework\App\RouterList">
    <arguments>
        <argument name="routerList" xsi:type="array">
            <item name="%name%" xsi:type="array">
                <item name="class" xsi:type="string">%classpath%</item>
                <item name="disable" xsi:type="boolean">false</item>
                <item name="sortOrder" xsi:type="string">%sortorder%</item>
            </item>
        </argument>
    </arguments>
</type>

* %name% - The unique name of your router in Magento.
* %classpath% - The path to your router class. Example: Magento\Robots\Controller\Router
* %sortorder% - The sort order of this entry in the router list.
```
### routes.xml
The routes.xml file maps which module to use for a URL with a specific frontName and area. The location of the routes.xml file in a module, either etc/frontend or etc/adminhtml, specifies where those routes are active.

The content of this file uses the following format:
```
routes.xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:App/etc/routes.xsd">
    <router id="%routerId%">
        <route id="%routeId%" frontName="%frontName%">
            <module name="%moduleName%"/>
        </route>
    </router>
</config>

* %routerId - specifies the name of the router in Magento. See the reference tables in the Router class section.
* %routeId% - specifies the unique node id for this route in Magento, is also the first segment of its associated layout handle XML filename (routeId_controller_action.xml).
* %frontName% - specifies the first segment after the base URL of a request.
* %moduleName% - specifies the name of your module.



```

### Action class

Action classes are implementations of the `ActionInterface` that a router returns on matched requests. The `execute()` function in these classes contain the logic for dispatching requests.

Each Action should implement one or more `Magento\Framework\App\Action\Http` HTTP `MethodActionInterface` to declare which HTTP request methods it can process. The most common ones are:

- `\Magento\Framework\App\Action\HttpDeleteActionInterface`
- `\Magento\Framework\App\Action\HttpGetActionInterface`
- `\Magento\Framework\App\Action\HttpPostActionInterface`
- `\Magento\Framework\App\Action\HttpPutActionInterface`

The application has a form key validation in place for all `POST` non-AJAX requests - if your Action doesn't need that validation or you want to modify it you can implement `CsrfAwareActionInterface`.