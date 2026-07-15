import { ICMSServer } from "@icms-api/server";
import { ICookies, IStorage } from "iboot-http-client";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";




// 定义获取数据的函数，可以在多个地方复用
export async function getWebsiteData() {
    const header = await headers();
    const body = NextResponse.next();
    const c = await cookies();
    const h = body.headers;
    const cookie: ICookies = {
        get(key) {
            return c.get(key)?.value
        },
        set(key, value) {
            console.log(`set cookies >>>${key}=${value}`)
            body.cookies.set(key, value)
        },
    }
    const headerStorage: IStorage = {
        set(key, value) {
            console.log(`set head >>> ${key}=${value}`)
            h.set(key, value)
        },
        get(key) {
            return header.get(key);
        },
    }
    const icms = new ICMSServer({
        cookie,
        headerStorage
    });
    return icms.loadWebsite();
}