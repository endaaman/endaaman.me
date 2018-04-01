.PHONY: build

all: dev

dev:
	npm run dev

build:
	docker build . -t endaaman/endaaman.me

push:
	docker push endaaman/endaaman.me

start: build
	docker-compose up --build
