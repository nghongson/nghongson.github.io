Create a simple patches
git add -f vendor/pronko/global-payments-meta/GlobalPaymentsHppSecure/Gateway/Country.php
git diff vendor/pronko/global-payments-meta/GlobalPaymentsHppSecure/Gateway/Country.php

git diff vendor/pronko/global-payments-meta/GlobalPaymentsHppSecure/Gateway/Country.php > patches/diff.patch

Let’s update the composer.json

```
"extra": {
    "patches": {
        "pronko/global-payments-meta": {
            "Fix for Invalid data in the HPP_SHIPPING_COUNTRY field.": "patches/CSS-143-HPP_COUNTRY_FIELD.patch"
        }
    }
}
```
