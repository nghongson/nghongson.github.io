# Security on Magento

- Session Manager

## Security Scan

```
token :  "gitlab.com": "Anr8wE1PnbZT9XYHZw7G"

curl --data tag=v1.0.0 https://__token__:Anr8wE1PnbZT9XYHZw7G@gitlab.com/api/v4/projects/28384517/packages/composer

Setup
auth.json
"gitlab-token": {
   "gitlab.com": "Anr8wE1PnbZT9XYHZw7G"
}
composer.json
"nover": {
            "type": "composer",
            "url": "https://gitlab.com/api/v4/group/nover/-/packages/composer/"
}
curl --data tag=<tag> "https://__token__:<personal-access-token>@gitlab.example.com/api/v4/projects/<project_id>/packages/composer"
composer config repositories.<group_id> composer https://gitlab.example.com/api/v4/group/<group_id>/-/packages/composer/
composer config gitlab-token.<DOMAIN-NAME> <personal_access_token>
composer require <package_name>:<version>
```

Install

```
bin/magento setup:install --cleanup-database \
--db-host=database \
--db-name=basem2 \
--db-user=root \
--db-password=root \
--admin-firstname=admin \
--admin-lastname=admin \
--admin-email=admin@admin.com \
--admin-user=admin \
--admin-password=admin123 \
--language=en_US \
--currency=USD \
--timezone=America/Chicago \
--use-rewrites=1 \
--search-engine=elasticsearch8 --elasticsearch-host=elasticsearch --elasticsearch-port=9200 --elasticsearch-index-prefix magento --elasticsearch-timeout 15


bin/magento module:disable Magento_TwoFactorAuth Magento_AdminAdobeImsTwoFactorAuth


curl -X PUT "https://elasticsearch:9200/_cluster/settings" -H "Content-Type: application/json" -d'
{
  "persistent": {
    "indices.id_field_data.enabled": true
  }
}'

Composer
composer config --list --global


```

2.4.3

https://developer.adobe.com/commerce/php/tutorials/backend/modify-image-library-permissions/

