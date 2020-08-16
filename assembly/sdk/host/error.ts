import { HostCallResult } from "./abi";

/**
 * Represents an error to call a host ABI function.
 */
export class HostCallError extends Error {
    constructor(message: string = "") {
        super(message);
        this.name = "HostCallError";
    }

    /**
     * Throws an error if call to the host ABI function has failed.
     */
    static propagate(status: HostCallResult, func: string, module: string = "env"): void {
        if (status != HostCallResult.SUCCESS) {
            throw new HostCallError("call to '" + module + "." + func + "' failed with status code " + status.toString());
        }
    }
}
