import { HttpFilter } from "../../extension/filter/http";
import {
    RootContext, Context,
    FilterHeadersStatusValues, FilterDataStatusValues, FilterTrailersStatusValues
} from "@solo-io/proxy-runtime";

/**
 * Represents a bridge between `HttpFilter` abstraction and its runtime representation.
 */
export class HttpFilterContext<T extends HttpFilter> extends Context {
    constructor(private httpFilter: T, context_id: u32, root_context: RootContext) {
        super(context_id, root_context);
    }
    onRequestHeaders(headersCount: u32): FilterHeadersStatusValues {
        return this.httpFilter.onRequestHeaders(headersCount) as FilterHeadersStatusValues;
    }
    onRequestBody(dataLength: usize, endOfStream: bool): FilterDataStatusValues {
        return this.httpFilter.onRequestBody(dataLength, endOfStream) as FilterDataStatusValues;
    }
    onRequestTrailers(trailersCount: u32): FilterTrailersStatusValues {
        return this.httpFilter.onRequestTrailers(trailersCount) as FilterTrailersStatusValues;
    }
    onResponseHeaders(headersCount: u32): FilterHeadersStatusValues {
        return this.httpFilter.onResponseHeaders(headersCount) as FilterHeadersStatusValues;
    }
    onResponseBody(dataLength: usize, endOfStream: bool): FilterDataStatusValues {
        return this.httpFilter.onResponseBody(dataLength, endOfStream) as FilterDataStatusValues;
    }
    onResponseTrailers(trailersCount: u32): FilterTrailersStatusValues {
        return this.httpFilter.onResponseTrailers(trailersCount) as FilterTrailersStatusValues;
    }
    onLog(): void {
        this.httpFilter.onExchangeComplete();
    }
}

/**
 * Represents an `HttpFilter` factory.
 */
export class HttpFilterFactory<T extends HttpFilter> extends RootContext {}
