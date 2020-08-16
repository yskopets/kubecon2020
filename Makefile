.PHONY: npm
npm:
	npm install

.PHONY: build
build:
	npm run asbuild:untouched

.PHONY: run
run: build
	getenvoy run wasm:nightly -- -c envoy/envoy.yaml

.PHONY: requests
requests:
	curl -i http://localhost:10000/api/products
	curl -i http://localhost:10000/api/orders
	curl -i http://localhost:10000/api/users

.PHONY: stats
stats:
	curl -s http://localhost:15000/stats | grep api_validator
