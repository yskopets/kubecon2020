/**
 * Represents an OpenAPI spec.
 */
export class ApiSpec {
    /** A list of operations in the API. */
    operations: Array<Operation>

    constructor(operations: Array<Operation>) {
        this.operations = operations;
    }

    /**
     * Returns `true` if OpenAPI spec includes an operation
     * with a given `method` and `path`.
     */
    contains(method: string, path: string): bool {
        for (let i = 0; i < this.operations.length; i++) {
            let operation = this.operations[i];
            if (operation.method.toUpperCase() == method.toUpperCase() &&
                Util.pathMatchesTemplate(path, operation.path)) {
                return true;
            }
        }
        return false;
    }
}

/**
 * Represents an API operation.
 */
export class Operation {
    method: string
    path: string
}

// import { HttpFilter, Stats, log, ops } from "./sdk";
// log.info("{ method: '" + method + "', path: '" + path + "'}");

export namespace ApiSpec {
    /**
     * Parses given configuration.
     * 
     * The format is `<verb> <path template>`, e.g.:
     * ```
     * GET /orders
     * PUT /ordres/{id}
     * ...
     * ```
     */
    export function parse(spec: string): ApiSpec {
        let operations = new Array<Operation>();
        let rules = spec.split("\n");
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i].trim();
            if (rule == "") {
                continue;
            }
            let methodAndPath = rule.split(" ", 2);
            if (methodAndPath.length != 2) {
                continue;
            }
            let method = methodAndPath[0];
            let path = methodAndPath[1].trim();
            if (method == "" || path == "") {
                continue;
            }
            operations.push({ method: method, path: path });
        }
        return new ApiSpec(operations);
    }
}

namespace Util {
    export function pathWithoutQuery(path: string): string {
        let queryIndex = path.indexOf("?");
        if (queryIndex >= 0) {
            path = path.substring(0, queryIndex);
        }
        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1);
        }
        return path;
    }

    export function pathMatchesTemplate(path: string, template: string): bool {
        let templateSegments = pathWithoutQuery(template).split("/");
        let pathSegments = pathWithoutQuery(path).split("/");
        if (templateSegments.length != pathSegments.length) {
            return false;
        }
        for (let i = 0; i < templateSegments.length; i++) {
            if (!segmentMatchesTemplate(pathSegments[i], templateSegments[i])) {
                return false;
            }
        }
        return true;
    }

    export function segmentMatchesTemplate(segment: string, template: string): bool {
        if (template.startsWith("{") && template.endsWith("}")) {
            return true;
        }
        return template == segment;
    }
}
