/**
 * Low-level ABI between Envoy and WebAssembly-based extensions.
 */

import { HostCallError } from "./error";

export type char = u8;
export type ptr<T> = usize; // all pointers are usize'd

export type HostCallResult = i32;

export namespace HostCallResult {
    // @ts-ignore: decorator
    @inline
    export const SUCCESS: HostCallResult = 0;
}

export type LogLevel = i32;

export namespace LogLevel {
    // @ts-ignore: decorator
    @inline
    export const TRACE: LogLevel = 0;
    // @ts-ignore: decorator
    @inline
    export const DEBUG: LogLevel = 1;
    // @ts-ignore: decorator
    @inline
    export const INFO: LogLevel = 2;
    // @ts-ignore: decorator
    @inline
    export const WARN: LogLevel = 3;
    // @ts-ignore: decorator
    @inline
    export const ERROR: LogLevel = 4;
    // @ts-ignore: decorator
    @inline
    export const CRITICAL: LogLevel = 5;
}

export type MetricType = i32;

export namespace MetricType {
    // @ts-ignore: decorator
    @inline
    export const COUNTER: MetricType = 0;
    // @ts-ignore: decorator
    @inline
    export const GAUGE: MetricType = 0;
    // @ts-ignore: decorator
    @inline
    export const HISTOGRAM: MetricType = 0;
}

export type MetricHandle = i32;

// @ts-ignore: decorator
@external("env", "proxy_log")
export declare function proxy_log(level: LogLevel, message: ptr<char>, critical_len: usize): HostCallResult;

// @ts-ignore: decorator
@external("env", "proxy_define_metric")
export declare function proxy_define_metric(type: MetricType, name: ptr<char>, name_len: usize, handle: ptr<MetricHandle>): HostCallResult;
// @ts-ignore: decorator
@external("env", "proxy_increment_metric")
export declare function proxy_increment_metric(handle: MetricHandle, offset: i64): HostCallResult;
// @ts-ignore: decorator
@external("env", "proxy_record_metric")
export declare function proxy_record_metric(handle: MetricHandle, value: u64): HostCallResult;
// @ts-ignore: decorator
@external("env", "proxy_get_metric")
export declare function proxy_get_metric(handle: MetricHandle, result: ptr<u64>): HostCallResult;

/**
 * Idiomatic AssemblyScript API for calling Host ABI functions.
 */
export namespace Host {
    export namespace Log {
        /**
         * Logs a given message at a given log level.
         */
        export function log(level: LogLevel, message: string): void {
            let message_buf = String.UTF8.encode(message);
            let message_len = message_buf.byteLength;
            let result = proxy_log(level, changetype<ptr<char>>(message_buf), message_len);
            HostCallError.propagate(result, "proxy_log", "env");
        }
    }

    export namespace Stats {
        /**
         * Defines a metric with a given type and name.
         */
        export function define(type: MetricType, name: string): MetricHandle {
            let name_buf = String.UTF8.encode(name);
            let name_len = name_buf.byteLength;
            let handle_ptr = memory.data(sizeof<MetricHandle>());
            let result = proxy_define_metric(type, changetype<ptr<char>>(name_buf), name_len, handle_ptr);
            HostCallError.propagate(result, "proxy_define_metric", "env");
            let handle = load<MetricHandle>(handle_ptr);
            return handle;
        }    

        /**
         * Increments a given counter or gauge by a given offset.
         */
        export function increment(handle: MetricHandle, offset: i64): void {
            let result = proxy_increment_metric(handle, offset);
            HostCallError.propagate(result, "proxy_increment_metric", "env");
        }

        /**
         * Returns a value of a given counter or gauge.
        */
        export function get(handle: MetricHandle): u64 {
            let value_ptr = memory.data(sizeof<u64>());
            let result = proxy_get_metric(handle, value_ptr);
            HostCallError.propagate(result, "proxy_get_metric", "env");
            let value = load<u64>(value_ptr);
            return value;
        }    
    }    
}
