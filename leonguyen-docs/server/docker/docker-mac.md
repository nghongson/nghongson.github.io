# Docker Mac version
## Error after upgrading to the latest Docker Desktop version on Mac.
Error 
```
failed to solve with frontend dockerfile.v0: failed to build LLB:
failed to compute cache key: "/.env" not found: not found
```
Resolve
```shell
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0
```
