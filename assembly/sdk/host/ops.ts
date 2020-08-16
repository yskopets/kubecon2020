import { stream_context } from "@solo-io/proxy-runtime";

/**
 * Returns a request header by name.
 */
export function getRequestHeader(name: string): string {
    return stream_context.headers.request.get(name)
}
