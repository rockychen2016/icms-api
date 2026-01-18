import { icmsRouter } from "@icms-api/router";
import { NextJsAdapter } from "iboot-http-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

}
export async function POST(request: NextRequest) {
    const adapter = new NextJsAdapter();
    return await icmsRouter({
        request: request,
        routeAdapter: adapter,
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
                },
            }
        }
    })
}