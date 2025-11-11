## Error mismatch : Check args

Check object args[args.length -1] to show name function, ...

```
function intakeDefines() {
            var args;
            takeGlobalQueue();
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                } else {
                    callGetModule(args);
                }
            }
            context.defQueueMap = {};
}
```

To avoid the error:

Be sure to load all scripts that call define() via the RequireJS API. Do not manually code script tags in HTML to load scripts that have define() calls in them.
If you manually code an HTML script tag, be sure it only includes named modules, and that an anonymous module that will have the same name as one of the modules in that file is not loaded.
If the problem is the use of loader plugins or anonymous modules but the RequireJS optimizer is not used for file bundling, use the RequireJS optimizer.
If the problem is the var define lint approach, use /_global define _/ (no space before "global") comment style instead.

Fixed:

```
/*global define*/
define([
    'dependency/one',
    'dependency/two'
], function (one, two) {

});
```

Fix with shim https://requirejs.org/docs/api.html#config-shim

```
require.config({
    paths: {
        // Alias for the jQuery library
        'jquery': 'path/to/jquery.min',

        // 1. Alias for the external SDK URL
        'js-sdk': 'url' // Replace 'url' with the actual script source URL
    },
    shim: {
        'js-sdk': {
            // 2. Define the global variable the script creates
            exports: 'jsSDK',

            // 3. Use 'init' to run the onload logic
            init: function () {
            }
        }
    }
});
```
