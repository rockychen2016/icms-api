import { icmsRouter } from "@icms-api/router";
import { NextJsAdapter } from "iboot-http-client";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

}
export async function POST(request: NextRequest) {
    return await icmsRouter({
        request: request,
        routeAdapter: new NextJsAdapter(),
        storage: {
            headers: {
                get(key) {
                    return request.headers.get(key);
                },
                set(key, value) {
                    request.headers.set(key, value);
                },
            },
            cookies: {
                get(key) {
                    return request.cookies.get(key)?.value;
                }
            }
        }
    })
}