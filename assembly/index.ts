/**
 * Force AssemblyScript compiler to generate "export" entries
 * expected by Envoy.
 */
export * from "@solo-io/proxy-runtime/proxy";

/**
 * Register `ApiValidator` extension when WebAssembly module is loaded
 * by Envoy.
 */
export * from "./factory";
