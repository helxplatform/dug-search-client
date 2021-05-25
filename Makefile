VERSION      := $(shell node -p "require('./package.json').version")
DOCKER_ORG   := helxplatform
DOCKER_TAG   := dug-search-client:${VERSION}

.DEFAULT_GOAL = help

.PHONY: build help publish

#help: List available tasks on this project
help:
	@grep -E '^#[a-zA-Z\.\-]+:.*$$' $(MAKEFILE_LIST) | tr -d '#' | awk 'BEGIN {FS = ": "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

#install.ci: install step for CI
install.ci:
	npm ci

#test.ci: run tests for CI
test.ci:
	CI=true npm test

#build: build project docker image
build:
	echo "Building docker image: $(DOCKER_TAG)"
	docker build . --no-cache --pull -t $(DOCKER_ORG)/$(DOCKER_TAG)

#publish: push all artifacts to registries
publish: build
	docker image push $(DOCKER_ORG)/$(DOCKER_TAG)
