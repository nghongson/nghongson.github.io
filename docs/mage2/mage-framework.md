# Magento 2 Framework

## ACL

## Authoration

## Autoload

## Config

## Console

## Controller

## Convert

## Cron

## EntityManager

## Encryption

## Exception

## Event

## Filter Template

## Reflection

## ObjectManager

## Logger

## Search

## Shell

## View - UI

## Currentcy

## Multiple Stores

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

\\ agento\Framework\Filesystem::getDirectoryWrite()
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

### Glob:
Laminas\Stdlib\Glob

### File

### File IO

### File upload




