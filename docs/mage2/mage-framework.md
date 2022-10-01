# Magento 2 Framework
https://www.magentoextensions.org/documentation/hierarchy.html

The Adobe Commerce and Magento Open Source framework (Commerce framework) controls how application components interact, including request flow, routing, indexing, caching, and exception handling. It provides services that reduce the effort of creating modules that contain business logic, contributing to the goal of both making Commerce code more modular as well as decreasing dependencies

## Framework highlights
The Commerce framework (lib/internal/Magento/Framework/) provides a robust range of functionality.

| NAMESPACE  | PURPOSE       |
|------------|:--------------|
Magento\Framework\DataObject | Provides standard functionality for storing and retrieving data through magic methods. This is the base class for many classes
Magento\Framework\Model	| Contains base Model classes that almost all model classes extend from.
Magento\Framework\Model\AbstractModel | 
Magento\Framework\Model\ResourceModel\AbstractResource |
Magento\Framework\Controller | 
Magento\Framework\View | Contains code to render pages and layouts.
Magento\Framework\Data | Contains additional classes that handle forms.
Magento\Framework\Url | Contains code to look up other pages.

Other namespaces under Magento\Framework that will interest extension developers:

| NAMESPACE  | PURPOSE       |
|------------|:--------------|
Magento\Framework\ObjectManager | Used to provide dependency injection.
Magento\Framework\App | Contains framework code that has knowledge about the Commerce application. This code bootstraps the application and reads in the initial configuration. It also contains the entry point to the command line tools, the web application, and the cron job. And finally, it routes requests while providing the deployment context (such as reading in the configuration for the database configuration, languages, and caching systems).
Magento\Framework\Api | Contains base classes for advanced functionality of extendable objects through the system (that is, objects that can be extended to add new data through Commerce Marketplace extensions).
Magento\Framework\Config | Contains the generic configuration reader. Each config file has its own specialized reader extending these classes.
Magento\Framework\Filesystem | Contains classes that handle reading from and writing to the file system.
Magento\Framework\HTTP\PhpEnvironment | 
Magento\Framework\Session | 
Magento\Framework\Stdlib\Cookie | Code to handle the HTTP request/responses as well as session/cookies is found here.
Magento\Framework\Exception | Contains the basic exceptions that are thrown throughout the Commerce codebase.
Magento\Framework\Event | Contains the code that publishes synchronous events and that handles observers for any Commerce event is handled here.
Magento\Framework\Validator | Contains the code that validates data (currencies, not empty) and that handles observers for any Commerce event.


## ACL
Access control list   
Access Control List (ACL) rules allow an admin to limit the permissions of users.  
Magento ACL use Zend/Acl  

### Load User & check ACL allow
```
Magento\Framework\AuthorizationInterface::isAllowed()
$this->authorization->isAllowed('Magento_InventoryApi::stock_edit');
\\ Admin

\\ Customer

\\ API
```

### New ACL
```
\\ etc/acl.xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Acl/etc/acl.xsd">
   <acl>
     <resources>
        <resource id="Magento_Backend::admin">
           <resource id="Vendor_MyModule::menu" title="Custom Menu" sortOrder="10" >
              <resource id="Vendor_MyModule::create" title="Create" sortOrder="50" />
              <resource id="Vendor_MyModule::delete" title="Delete" sortOrder="100" />
              <resource id="Vendor_MyModule::view" title="View" sortOrder="150">
                 <resource id="Vendor_MyModule::view_additional" title="View Additional Information" sortOrder="10" />
              </resource>
           </resource>
        </resource>
     </resources>
   </acl>
</config>

\\ Clean Cache
bin/magento cache:clean

```
### Restrict admin controllers
```
\\ use on Controller/Adminhtml/Create/Index.php
const ADMIN_RESOURCE = 'Vendor_MyModule::create'
const ADMIN_RESOURCE = 'Vendor_MyModule::delete';
```
### Content restrictions for admin users
\\ use on block xml
```
\\ aclResource
<block class="Vendor\MyModule\Block\Adminhtml\Type" name="block.example" aclResource="Vendor_MyModule::view_additional">
    <!-- ... -->
</block>
```
### Restrict web API access
```
\\ resource
<?xml version = "1.0"?>
<routes xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Webapi:etc/webapi.xsd">
    <route url="/V1/admin/create" method="POST">
        <service class="Vendor\MyModule\Api\Create" method="execute"/>
        <resources>
            <resource ref="Vendor_MyModule::create" />
        </resources>
    </route>
</routes>
```
### Restrict web API menu
```
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Backend:etc/menu.xsd">
    <menu>
     <add id="Vendor_MyModule::menu" title="Custom Menu" module="Vendor_MyModule" sortOrder="10" resource="Vendor_MyModule::menu"/>
     <add id="Vendor_MyModule::create" title="Create" module="Vendor_MyModule" sortOrder="10" parent="Vendor_MyModule::menu" action="custommenu/create/index" resource="Vendor_MyModule::create"/>
     <add id="Vendor_MyModule::delete" title="Delete" module="Vendor_MyModule" sortOrder="20" parent="Vendor_MyModule::menu" action="custommenu/delete/index" resource="Vendor_MyModule::delete"/>
     <add id="Vendor_MyModule::view" title="View" module="Vendor_MyModule" sortOrder="30" parent="Vendor_MyModule::menu" action="custommenu/view/index" resource="Vendor_MyModule::view"/>
    </menu>
</config>
```

## API
### SearchCriteria
### Search


## Authorization

## Autoload
**Autoload** library contains an abstract wrapper for Composer's generated autoloader.

* AutoloaderInterface provides abstract ability use and modify the autoloader class.
* AutoloaderRegistry allows the same instance of the autoloader to put accessed across the code base.
* ClassLoaderWrapper wraps around Composer's generated autoloader in order to insulate it.
* Populator fills in PSR-0 and PSR-4 standard namespace-directory mappings for the autoloader.
## Archive
Archive library provides functionalities for archiving files including following formats:
* tar
* gz
* bzip2

## Async
Async library provides classes to work with asynchronous/deferred operations, for instance sending an HTTP request.
## Config

### Config xml
### Config schema
### Sensitive config
Sensitive and system-specific
### Environment variables
### Config on production

### How to "Create configuration types"
To create a configuration type, you must add at minimum:
- A loader
- XSD validation schema
- XML configuration files

[Refrence magento docs](https://experienceleague.adobe.com/docs/commerce-operations/configuration-guide/files/config-create-types.html)

Reader
```
\\ \Magento\Framework\Config\Reader\Filesystem
```
Convert
```
\\ \Magento\Framework\Config\ConverterInterface

```
Schema
```
\Magento\Framework\Config\SchemaLocatorInterface

```
## Console
This component contains Magento Cli and can be extended via DI configuration.

For example we can introduce new command in module using di.xml:

```
<type name="Magento\Framework\Console\CommandListInterface">
    <arguments>
        <argument name="commands" xsi:type="array">
            <item name="test_me" xsi:type="object">Magento\MyModule\Console\TestMeCommand</item>
        </argument>
    </arguments>
</type>
```
## Controller
### Admin & Frontend
### GET, POST, PUSH, DELETE
### Response data type
Allowed result types
- json
- raw
- redirect
- forward
- layout
- page


Frontend controller
```
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;

class NewController extends Action implements HttpGetActionInterface, HttpPostActionInterface

public function execute()
{
    $resultPage = $this->pageHelper->prepareResultPage($this, $this->getPageId());
    if (!$resultPage) {
        $resultForward = $this->resultForwardFactory->create();
        return $resultForward->forward('noroute');
    }
    return $resultPage;
}
```

Backend Controller
```

```

## Convert

## Cron

## EntityManager
**EntityManager** library contains functionality for entity persistence layer.
EntityManager supports persistence of basic entity attributes as well as extension and custom attributes 
added by 3rd party developers for the purpose of extending default entity behavior.

It's not recommended to use EntityManager and its infrastructure for entity persistence.

Currently, it's recommended to use Resource Model infrastructure and make a successor of 
Magento\Framework\Model\ResourceModel\Db\AbstractDb class or successor of 
Magento\Eav\Model\Entity\AbstractEntity if EAV attributes support needed.

For filtering operations, it's recommended to use successor of 
Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection class.

## Encryption
The Encryption library provides functionalities such as hashing passwords, encrypting/decrypting data, URLs encoding, using cryptographic algorithms.
```
Ecryption password
Magento\Framework\Encryption\Encryptor::getHash()


// Url encode/decode use Magento\Framework\Url 
// Magento\Framework\Url\Encode
// Magento\Framework\Url\Decode
```
## Exception
List Exceptions.
```
AbstractAggregateException
AlreadyExistsException
AuthenticationException : The consumer isn't authorized to access resources
BulkException : Exception thrown while processing bulk of entities
ConfigurationMismatchException : Configuration mismatch detected.
CouldNotDeleteException 
CouldNotSaveException
CronException
EmailNotConfirmedException
FileSystemException
InputException: 'input invalid';
IntegrationException
InvalidArgumentException
InvalidEmailOrPasswordException
LocalizedException
MailException
NoSuchEntityException: No such entity is an exception when finding an entity.
NotFoundException
PaymentException
RemoteServiceUnavailableException
RuntimeException
SecurityViolationException
SerializationException
SessionException
StateException
ValidatorExceptio
```
## Event
**Event** library provides supports for Magento events.
```
// Event manager
// Used to dispatch global events
// Magento\Framework\Event\Manager

/**
 * Dispatch event
 *
 * Calls all observer callbacks registered for this event
 * and multiple observers matching event name pattern
 *
 * @param string $eventName
 * @param array $data
 * @return void
 */
public function dispatch($eventName, array $data = [])
{
    $eventName = mb_strtolower($eventName);
    \Magento\Framework\Profiler::start('EVENT:' . $eventName, ['group' => 'EVENT', 'name' => $eventName]);
    foreach ($this->_eventConfig->getObservers($eventName) as $observerConfig) {
        $event = new \Magento\Framework\Event($data);
        $event->setName($eventName);

        $wrapper = new Observer();
        $wrapper->setData(array_merge(['event' => $event], $data));

        \Magento\Framework\Profiler::start('OBSERVER:' . $observerConfig['name']);
        $this->_invoker->dispatch($observerConfig, $wrapper);
        \Magento\Framework\Profiler::stop('OBSERVER:' . $observerConfig['name']);
    }
    \Magento\Framework\Profiler::stop('EVENT:' . $eventName);
}

// Dispatches an event to observer's callback
// Magento\Framework\Event\Observer

/**
* Dispatches an event to observer's callback
*
* @param Event $event
* @return $this
*/
public function dispatch(Event $event)
{
    if (!$this->isValidFor($event)) {
        return $this;
    }

    $callback = $this->getCallback();
    $this->setEvent($event);

    $_profilerKey = 'OBSERVER: ';
    if (is_object($callback[0])) {
        $_profilerKey .= get_class($callback[0]);
    } else {
        $_profilerKey .= (string)$callback[0];
    }
    $_profilerKey .= ' -> ' . $callback[1];

    \Magento\Framework\Profiler::start($_profilerKey);
    call_user_func($callback, $this);
    \Magento\Framework\Profiler::stop($_profilerKey);

    return $this;
}

```

## Filter Template

## HTTP
## Message
**Message** library is responsible for message creation and management.
```

/**
 * @var MessageManagerInterface
 */
protected $messageManager;
// $context Magento\Framework\App\Action\Context
$this->messageManager = $context->getMessageManager();

$this->messageManager->addSuccessMessage(__('msg'));
$this->messageManager->addWarningMessage(__('msg'));
```
## ObjectManager

## Phrase
Class *\Magento\Framework\Phrase* calls renderer to make the translation of the text.
```
__('text')
```
## Logger
**Logger** provides a standard mechanism to log to system and error logs.(**Molologger**)

## Search

## Shell
A library with object-oriented interface for generation of shell commands

## View - UI

## Multiple Stores
### Currentcy
### Locale

## Files

Magento/FileSystem:

The library includes File, HTTP, HTTPS and Zlib drivers.

### FileSystem Driver
```
File

HTTP

HTTPS

Zlib
```
### Directory
\Magento\Framework\Filesystem\DirectoryList  
class defines list of directories available in the application.
```
\\ \Magento\Framework\App\Filesystem\DirectoryList
$result = [
    self::ROOT => [parent::PATH => ''],
    self::APP => [parent::PATH => 'app'],
    self::CONFIG => [parent::PATH => 'app/etc'],
    self::LIB_INTERNAL => [parent::PATH => 'lib/internal'],
    self::VAR_DIR => [parent::PATH => 'var'],
    /** @deprecated  */
    self::VAR_EXPORT => [parent::PATH => 'var/export'],
    self::CACHE => [parent::PATH => 'var/cache'],
    self::LOG => [parent::PATH => 'var/log'],
    self::DI => [parent::PATH => 'generated/metadata'],
    self::GENERATION => [parent::PATH => Io::DEFAULT_DIRECTORY],
    self::SESSION => [parent::PATH => 'var/session'],
    self::MEDIA => [parent::PATH => 'pub/media', parent::URL_PATH => 'media'],
    self::STATIC_VIEW => [parent::PATH => 'pub/static', parent::URL_PATH => 'static'],
    self::PUB => [parent::PATH => 'pub', parent::URL_PATH => ''],
    self::LIB_WEB => [parent::PATH => 'lib/web'],
    self::TMP => [parent::PATH => 'var/tmp'],
    self::UPLOAD => [parent::PATH => 'pub/media/upload', parent::URL_PATH => 'media/upload'],
    self::TMP_MATERIALIZATION_DIR => [parent::PATH => 'var/view_preprocessed/pub/static'],
    self::TEMPLATE_MINIFICATION_DIR => [parent::PATH => 'var/view_preprocessed'],
    self::SETUP => [parent::PATH => 'setup/src'],
    self::COMPOSER_HOME => [parent::PATH => 'var/composer_home'],
    self::GENERATED => [parent::PATH => 'generated'],
    self::GENERATED_CODE => [parent::PATH => Io::DEFAULT_DIRECTORY],
    self::GENERATED_METADATA => [parent::PATH => 'generated/metadata'],
    self::VAR_IMPORT_EXPORT => [parent::PATH => 'var', parent::URL_PATH => 'import_export'],
];
```

Get directory
```
\\ Magento\Framework\Filesystem::getDirectoryRead()
\\ ==> Magento\Framework\Filesystem\Directory\Read implement 
getAbsolutePath
getRelativePath
read
search
isExist
stat
isReadable
isFile
isDirectory
openFile
readFile

\\ Magento\Framework\Filesystem::getDirectoryWrite()
\\ ==> Magento\Framework\Filesystem\Directory\Write
create
delete
renameFile
copyFile
createSymlink
changePermissions
changePermissionsRecursively
openFile
writeFile

// Get get absolute path
$directory->getAbsolutePath()
// Get relative path
$directory->getRelativePath()

// Magento\Framework\App\Filesystem\DirectoryResolver::validatePath()
// Magento directories resolver.
$path = $this->getStorage()->getSession()->getCurrentPath();
if (!$this->directoryResolver->validatePath($path, DirectoryList::MEDIA)) {
    throw new \Magento\Framework\Exception\LocalizedException(
        __('Directory %1 is not under storage root path.', $path)
    );
}

```

### Glob
Laminas\Stdlib\Glob

### File
Read & Write file 
```
\\ Magento\Framework\Filesystem\File\Read  
\\ Magento\Framework\Filesystem\File\Write  
```


### File IO
Steam files with FILE, FTP, SFTP

### File upload


### Csv

## Serializer
Serialize library provides interface SerializerInterface

 * *Json* - default implementation. Uses PHP native json_encode/json_decode functions;
 * *JsonHexTag* - default implementation. Uses PHP native json_encode/json_decode functions with `JSON_HEX_TAG` option enabled;
 * *Serialize* - less secure than *Json*, but gives higher performance on big arrays. Uses PHP native serialize/unserialize functions, does not unserialize objects on PHP 7.
```
\\ __construct(\Magento\Framework\Serialize\SerializerInterface $serializerInterface)
$this->serializer = $serializerInterface ?: \Magento\Framework\App\ObjectManager::getInstance()
            ->get(\Magento\Framework\Serialize\Serializer\JsonHexTag::class);
...
$this->serializer->serialize($arrays);
$this->serializer->unserialize($string)

```

## Session

### Standard session management
```
Magento\Framework\Session\SessionManager

```

### Session handler
- File
- Db
- Redis

### Security
- Session ID
- Validator
```
Validate REMOTE_ADDR
Validate HTTP_VIA
Validate HTTP_X_FORWARDED_FOR
Validate HTTP_USER_AGENT

Validator with domain, lifetime, path, samesite

```
- Session Size Config
```
Max session size admin & frontend
```
- Session Lifetime
```
Admin Session Lifetime

```

### Logger & Debug session
```
Cookies => Session
```

## URL
URL encode, decode, validator

## Escaper

## Debug & Profiler

