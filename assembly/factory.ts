import {
    Context, RootContextHelper, registerRootContext
} from "@solo-io/proxy-runtime";

import { HttpFilterContext, HttpFilterFactory } from "./sdk";
import { ApiValidator } from "./filter";

/**
 * Factory for `ApiValidator` extension.
 */
class ApiValidatorFilterFactory extends HttpFilterFactory<ApiValidator> {

    /**
     * Name the extension should be referred to in `Envoy` configuration.
     */
    static NAME: string = "api_validator";

    /**
     * Creates a seperate instance of `ApiValidator` filter for each HTTP request.
     */
    createContext(context_id: u32): Context {
        return new HttpFilterContext<ApiValidator>(new ApiValidator(this.getConfiguration()), context_id, this);
    }
}

/**
 * The following top-level logic will be executed at the moment when `WebAssembly`
 * module is loaded by `Envoy`.
 */
registerRootContext((context_id: u32) => {
    return RootContextHelper.wrap(new ApiValidatorFilterFactory(context_id));
}, ApiValidatorFilterFactory.NAME);
