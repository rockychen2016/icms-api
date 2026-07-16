import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getServerHttpCookies, getServerHttpOpts, ICookies, IStorage } from "@rock.chen/icms-http-client";
import { ICMSServer } from "@icms-api/server";

export async function proxy(request: NextRequest) {
    const rh = await headers();
    const headerStore: IStorage = {
        get(key) {
            return rh.get(key)
        },
    }
    let httpOpts = getServerHttpOpts(headerStore);
    if (!httpOpts.lang || !httpOpts.websiteId || !httpOpts.websiteNo) {
        const rc = await cookies();
        const c: ICookies = {
            get(key) {
                return rc.get(key)?.value;
            },
        }
        httpOpts = getServerHttpCookies(c);
    }

    console.log('------------------httpOpts---', JSON.stringify(httpOpts));

    if (httpOpts.lang && httpOpts.websiteId && httpOpts.websiteNo) {
        return NextResponse.next();
    }
    const response = NextResponse.next();
    const icms = new ICMSServer({
        headerStorage: {
            get(key) {
                return rh.get(key)
            },
        }
    })
    await icms.helloWebsite({
        set(key, value) {
            response.headers.set(key, value);
        }
    }, {
        set(key, value) {
            response.cookies.set(key, value);
        },
    })
    return response;
}

export const config = {
    matcher: [
        '/((?!trpc|_next|_vercel|.*\\..*).*)', //排除规则
        '/static/:path*'                       //这是例外静态资源转发
    ]
}