import { NextRequest, NextResponse } from "next/server";
import { handleMiddleware } from "@icms-api/middleware";
import { headers } from "next/headers";

export async function proxy(request: NextRequest, response:NextResponse) {
    // const h = request.headers;
    // const writeCookies= response.cookies;
    // const readCookies = request.cookies;
    // const header = await headers();
    // handleMiddleware({
    //     cookies:{
    //         async set(key, value) {
    //             writeCookies.set(key, value)
    //         },
    //     },
    //     storage:{
    //         set(key, value) {
    //             h.set(key, value)
    //         },
    //         get(key) {
    //             return header.get(key);
    //         },
    //     },
    //     values:{
    //         deviceId:'ABC',
    //         lang:readCookies.get('NEXT_LOCALE')?.value,
    //         websiteId:readCookies.get('wid')?.value,
    //         websiteNo:readCookies.get('wno')?.value
    //     }
    // })
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!trpc|_next|_vercel|.*\\..*).*)', //排除规则
        '/static/:path*'                       //这是例外静态资源转发
    ]
}