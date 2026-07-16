import { icmsRouter } from "@icms-api/router";
import { NextJsAdapter } from "@rock.chen/icms-http-client";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";

const routerHandle = async (request:NextRequest) => {
    const adapter = new NextJsAdapter();
    const c = await cookies();
    const h = await headers();
    return await icmsRouter({
        request: request,
        routeAdapter: adapter,
        storage: {
            headers: {
                get(key) {
                    return h.get(key);
                },
            },
            cookies: {
                get(key) {
                    return c.get(key)?.value;
                },
            }
        }
    })
}

export async function GET(request: NextRequest) {
    return await routerHandle(request);
}
export async function POST(request: NextRequest) {
    return await routerHandle(request);
}