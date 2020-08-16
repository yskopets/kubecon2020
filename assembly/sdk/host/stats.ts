import {
    Host, MetricType, MetricHandle, LogLevel
} from "./abi";

/**
 * Represents a Counter.
 */
export interface Counter {
    inc(): void;
    add(offset: u64): void;
    value(): u64;
}

export namespace HostStats {
    /**
     * Returns a `Counter` by name.
     */
    export function counter(name: string): HostCounter {
        return new HostCounter(Host.Stats.define(MetricType.COUNTER, name));
    }
}

export { HostStats as Stats };

/**
 * Represents an Envoy Counter.
 */
class HostCounter implements Counter {
    constructor(private metric: MetricHandle) {}

    inc(): void {
        Host.Log.log(LogLevel.INFO, "metric handle = " + this.metric.toString());
        this.add(1);
    }
    add(offset: u64): void {
        Host.Stats.increment(this.metric, offset as i64);
    }
    value(): u64 {
        return Host.Stats.get(this.metric);
    }
}
