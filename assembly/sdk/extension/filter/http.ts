export const enum FilterHeadersStatus {
    Continue,
    StopIteration,
}

export const enum FilterDataStatus {
    Continue,
    StopIterationAndBuffer,
}

export const enum FilterTrailersStatus {
    Continue,
    StopIteration,
}

export abstract class HttpFilter {
    onRequestHeaders(_headersCount: u32): FilterHeadersStatus {
        return FilterHeadersStatus.Continue
    }
    onRequestBody(_dataLength: usize, _endOfStream: bool): FilterDataStatus {
        return FilterDataStatus.Continue
    }
    onRequestTrailers(_trailersCount: u32): FilterTrailersStatus {
        return FilterTrailersStatus.Continue
    }
    onResponseHeaders(_headersCount: u32): FilterHeadersStatus {
        return FilterHeadersStatus.Continue
    }
    onResponseBody(_dataLength: usize, _endOfStream: bool): FilterDataStatus {
        return FilterDataStatus.Continue
    }
    onResponseTrailers(_trailersCount: u32): FilterTrailersStatus {
        return FilterTrailersStatus.Continue
    }
    onExchangeComplete(): void { }
}

export interface HttpFilterOps {
    getRequestHeader(name: string): string;
}
