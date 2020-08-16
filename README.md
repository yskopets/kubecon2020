# About

Source code for `Making Envoy contributions Feasible for Everyone` talk at `KubeCon 2020`.

[Slides](https://static.sched.com/hosted_files/kccnceu20/7e/Making_Envoy_Contributions_Feasible_For_Everyone_Yaroslav_Skopets.pdf)

# How To's

## Pre-requirements

### Install NodeJS

See instructions on [NodeJS](https://nodejs.org/en/download/).

### Install NPM dependencies

```shell
$ make npm
```

### Install GetEnvoy

```shell
$ curl -L https://getenvoy.io/cli | bash -s -- -b /usr/local/bin
```

### Fetch build of Envoy with WebAssembly support

```shell
$ getenvoy fetch wasm:nightly
```

## How To test

### Start Envoy

To start `Envoy`, run:
```shell
$ make run
```

To make sample requests, run:
```shell
$ make requests
```

To inspect `Envoy` metrics:
```shell
$ make stats
```

## Walkthrough

### Walkthrough: Getting Started

_assemblyscript/filter.ts_:
```typescript
import { HttpFilter, log } from "./sdk";

export class ApiValidator extends HttpFilter {
  constructor(_config: string) {
    super();
    log.info("hello world!");
  }
}
```

### Walkthrough: Data model

_assemblyscript/model.ts_:
```typescript
export class ApiSpec {
  operations: Array<Operation>
}

export class Operation {
  method: string
  path:   string
}
```

### Walkthrough: Configuration

_assemblyscript/filter.ts_:
```typescript
import { HttpFilter } from "./sdk";
import { ApiSpec } from "./model";

export class ApiValidator extends HttpFilter {
  private spec: ApiSpec

  constructor(config: string) {
    super();
    this.spec = ApiSpec.parse(config);
  }
}
```

### Walkthrough: Request validation

_assemblyscript/filter.ts_:
```typescript
import { HttpFilter, log, ops } from "./sdk";
import { ApiSpec } from "./model";

export class ApiValidator extends HttpFilter {
  private spec: ApiSpec

  constructor(config: string) { 
    super();
    this.spec = ApiSpec.parse(config);
  }

  onExchangeComplete(): void {
    let method = ops.getRequestHeader(":method")
    let path   = ops.getRequestHeader(":path")

    if (!this.spec.contains(method, path)) {
      log.warn("unknown API: " + method + " " + path);
    }
  }
}
```

### Walkthrough: Metrics

_assemblyscript/filter.ts_:
```typescript
import { HttpFilter, Stats, log, ops } from "./sdk";
import { ApiSpec } from "./model";

export class ApiValidator extends HttpFilter {
  private spec: ApiSpec

  constructor(config: string) { 
    super();
    this.spec = ApiSpec.parse(config);
  }

  onExchangeComplete(): void {
    let method = ops.getRequestHeader(":method")
    let path   = ops.getRequestHeader(":path")

    if (!this.spec.contains(method, path)) {
      log.warn("unknown API: " + method + " " + path);
    }

    if (!this.spec.contains(method, path)) {
      Stats.counter("api_validator.violations_total").inc();
    }
  }
}
```
