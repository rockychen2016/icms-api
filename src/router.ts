import { FrameworkAdapter, HTTPRouter, RouteStorage, USER_TYPE_MAP } from "@rock.chen/icms-http-client";
import { helloURL } from "./server";

//定义客户端接口
const APIMAP = {

}
export const icmsRouter = async <T, R>({
    request,
    routeAdapter,
    storage
}: Readonly<{
    request: T
    routeAdapter: FrameworkAdapter<T, R>
    storage: RouteStorage
}>): Promise<R> => {
    const router = new HTTPRouter({
        "config": {
            "userType": USER_TYPE_MAP.TYPE_C,
            "APIMAP": APIMAP,
            "helloURL": helloURL
        },
        "adapter": routeAdapter,
        "storage": storage
    });
    return await router.handleRequest(request);
}