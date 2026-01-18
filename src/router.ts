import { FrameworkAdapter, getServerHttpCookies, HTTPRouter, RouteStorage, USER_TYPE_MAP } from "iboot-http-client";
import { helloURL, ICMSServer } from "./server";

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
    const options = getServerHttpCookies(storage.cookies);
    console.log("options >>>> ", options)
    const icms = new ICMSServer(options);
    if (!options.websiteId || options.websiteId.trim().length === 0) {
        await icms.helloWebsite(storage.headers);
    }
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