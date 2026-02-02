# Composer production

composer install --no-dev

bin/magento setup:di:compile

composer dump-autoload -o --apcu
