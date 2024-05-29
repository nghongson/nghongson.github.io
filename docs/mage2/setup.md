---
sidebar_position: 15
---

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
