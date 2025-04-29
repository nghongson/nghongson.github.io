.SILENT:
## Colors
COLOR_RESET   = \033[0m
COLOR_INFO    = \033[32m
COLOR_COMMENT = \033[33m

dev := lovea-dev.lpo.sutunam.info@lovea-dev.lpo.sutunam.info
dev2 := lovea2-dev.lpo.sutunam.info@lovea2-dev.lpo.sutunam.info
prod := lovea.fr@lovea.fr
db_dev := lovea_dev_lpo_sutunam_info
db_dev2 := lovea2_dev_lpo_sutunam_info
db_prod := lovea_fr

BACKUP_DIR = ~/backup
DATABASE_BACKUP = $(BACKUP_DIR)/database
CODE_BACKUP = $(BACKUP_DIR)/code

## Help
help:
	printf "${COLOR_COMMENT}Usage:${COLOR_RESET}\n"
	printf " make [target]\n\n"
	printf "${COLOR_COMMENT}Available targets:${COLOR_RESET}\n"
	echo $(MAKEFILE_LIST)
	awk '/^[a-zA-Z\-\_0-9\.@]+:/ { \
    helpMessage = match(lastLine, /^## (.*)/); \
    if (helpMessage) { \
		    helpCommand = substr($$1, 0, index($$1, ":")); \
      helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
      printf " ${COLOR_INFO}%-16s${COLOR_RESET} %s\n", helpCommand, helpMessage; \
    } \
  } \
  { lastLine = $$0 }' $(MAKEFILE_LIST)
## Deploy magento
deploy:
	echo "Deploy Magento"
	php bin/magento maintenance:enable
	rm -rf generated/code/* generated/metadata/*
	rm -rf var/page_cache/* var/view_preprocessed/* var/cache/*
	rm -rf pub/static/frontend/* pub/static/adminhtml/*
	php bin/magento cache:fl
	php bin/magento set:di:com
	php bin/magento set:static:dep -f fr_FR en_US
	php bin/magento cache:fl
	php bin/magento maintenance:disable
## Enable maintenance mode
maintenance_en:
	echo "Enable Maintenance Mode"
	php bin/magento maintenance:enable
## Disable maintenance mode
maintenance_dis:
	php bin/magento maintenance:disable
	echo "Disable Maintenance Mode"
## Deploy magento frontend
deploy-front-theme:
	$(MAKE) maintenance_en
	echo "Deploy frontend only theme on DEV"
	rm -rf var/page_cache/* var/view_preprocessed/*
	rm -fr pub/static/frontend/*
	php bin/magento cache:fl
	php bin/magento set:static:dep -f fr_FR en_US -t "Dbm/biocos" -a "frontend"
	php bin/magento cache:fl
	$(MAKE) maintenance_dis
## Deploy magento update
deploy-update:
	$(MAKE) maintenance_en
	php bin/magento set:up
	$(MAKE) deploy
	$(MAKE) maintenance_dis
## SSH to dev site
ssh_dev:
	ssh $(dev)
## SSH to dev 2 site
ssh_dev2:
	ssh $(dev2)
## SSH to prod site
ssh_prod:
	ssh $(prod)
## SSH to dev site
add_ssh_dev:
	ssh-copy-id $(dev)
## SSH to dev 2 site
add_ssh_dev2:
	ssh-copy-id $(dev2)
## SSH to prod site
add_ssh_prod:
	ssh-copy-id $(prod)
## Get media data dev site
get_media_dev:
	rsync -avz $(dev):~/public_html/pub/media/ ./pub/media/
## Get media data prod site
get_media_prod:
	rsync -avz $(prod):~/public_html/pub/media/ ./pub/media/
## Push style data to dev site
push_style_dev:
	rsync -avz ./app/design/frontend/Dbm/biocos/web/proto/app/assets/styles/local/* $(dev):~/public_html/app/design/frontend/Dbm/biocos/web/proto/app/assets/styles/local/
## Push style data to dev site
push_style_dev2:
	rsync -avz ./app/design/frontend/Dbm/biocos/web/proto/app/assets/styles/local/* $(dev2):~/public_html/app/design/frontend/Dbm/biocos/web/proto/app/assets/styles/local/
## Push style data to dev site
push_style_prod:
	rsync -avz ./app/design/frontend/Dbm/biocos/web/proto/app/assets/styles/local/* $(prod):~/public_html/app/design/frontend/Dbm/biocos/web/proto/app/assets/styles/local/
## Backup database dev site
backup_db_dev:
	mkdir -p $(DATABASE_BACKUP)
	mysqldump $(db_dev) --single-transaction | pigz -9 -c > $(DATABASE_BACKUP)/$(db_dev)_`date  +%Y-%m-%d:%H:%M:%S`.sql.gz
## Backup database product site
backup_db_prod:
	mkdir -p $(DATABASE_BACKUP)
	mysqldump $(db_prod) --single-transaction | pigz -9 -c > $(DATABASE_BACKUP)/$(db_prod)_`date  +%Y-%m-%d:%H:%M:%S`.sql.gz
## Optimize image
optimize_image:
	bin/optimize-images.sh -v > ./var/log/optim_images.log 2>&1
## Setup product config
prod-conf:
	php bin/magento config:set dev/static/sign 1
	# config js
	php bin/magento config:set dev/js/enable_js_bundling 0
	php bin/magento config:set dev/js/minify_files 1
	bin/magento config:set dev/js/merge_files 1
	# config css
	bin/magento config:set dev/css/merge_css_files 1
	bin/magento config:set dev/css/minify_files 1
## Setup dev config
dev-conf:
	php bin/magento config:set dev/static/sign 0
	# config js
	php bin/magento config:set dev/js/enable_js_bundling 0
	php bin/magento config:set dev/js/minify_files 0
	bin/magento config:set dev/js/merge_files 0
	# config css
	bin/magento config:set dev/css/merge_css_files 0
	bin/magento config:set dev/css/minify_files 0
