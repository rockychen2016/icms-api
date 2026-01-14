import { ICMSServer } from "@icms-api/server";
import {   getServerHttpCookies, ICookies } from "iboot-http-client";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    console.log('current path >>> ', path);
    let response = NextResponse.next();
    response.headers.set('R-rock', '123')
    if (path.startsWith('/')) {
        const cookies: ICookies = {
            get(key) {
                return request.cookies.get(key)?.value
            },
            set(key, value, opts) {
                response.cookies.set(key, value, opts);
            },
        }
        const httpOpts = getServerHttpCookies(cookies);
        console.log('---------------------------------------', httpOpts)
        const icms = new ICMSServer(httpOpts);
        await icms.helloWebsite({"cookies":cookies})
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!trpc|_next|_vercel|.*\\..*).*)', //排除规则
        '/static/:path*'                           //这是例外静态资源转发
    ]
}