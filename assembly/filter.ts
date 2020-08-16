import { HttpFilter, Stats, log, ops } from "./sdk";
import { ApiSpec } from "./model";

/**
 * HttpFilter that verifies whether a request served by the application
 * is in fact described by the OpenAPI spec.
 */
export class ApiValidator extends HttpFilter {
  /** API spec to validate against. */
  private spec: ApiSpec

  constructor(config: string) {
    super();
    this.spec = ApiSpec.parse(config);
  }

  /**
   * Called when HTTP stream is complete.
   */
  onExchangeComplete(): void {
    let method = ops.getRequestHeader(":method")
    let path = ops.getRequestHeader(":path")

    if (!this.spec.contains(method, path)) {
      log.warn("unknown API: " + method + " " + path);
    }

    if (!this.spec.contains(method, path)) {
      Stats.counter("api_validator.violations_total").inc();
    }
  }
}
