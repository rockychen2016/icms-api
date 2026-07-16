import { FrameworkAdapter, HTTPRouter, RouteStorage, USER_TYPE_MAP } from "@rock.chen/icms-http-client";
import { helloURL } from "./server";

const APIMAP = {

}
export const icmsRouter = async <T, R>({
    request,
    routeAdapter,
    storage
}: Readonly<{
    request: T,
    routeAdapter: FrameworkAdapter
    storage: RouteStorage
}>): Promise<R> => {
    const res = new HTTPRouter({
        "config": {
            "userType": USER_TYPE_MAP.TYPE_B,
            "APIMAP": APIMAP,
            "helloURL": helloURL
        },
        "adapter": routeAdapter,
        "storage": storage
    });
    return await res.handleRequest<T, R>(request);
}