import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest, response:NextResponse) {
     
    const path = request.nextUrl.pathname;
    return NextResponse.next();

}

export const config = {
    matcher: [
        '/((?!trpc|_next|_vercel|.*\\..*).*)', //排除规则
        '/static/:path*'                           //这是例外静态资源转发
    ]
}