---
sidebar_position: 6
---
# Request Flow Processing
https://fixes.co.za/magento2/magento-2-request-flow/

Request hits index.php in root folder of Magento 2.

Environment initialization

Autoloader
```
require_once __DIR__ . '/autoload.php';
// Sets default autoload mappings, may be overridden in Bootstrap::create
\Magento\Framework\App\Bootstrap::populateAutoloader(BP, []);
```

// Load bootstrap
$bootstrap = Bootstrap::create(BP, $_SERVER);
Init object manager form ServerInitParmas

// Create app
$app = $bootstrap->createApplication(\Magento\Framework\App\Http::class);


// Init config
// Init cache
// Request
// Response
