import { ICMSServer } from "@icms-api/server";
import { getServerHttpCookies, ICookies } from "iboot-http-client";
import { cookies } from "next/headers";

const c = await cookies();
const mycookie: ICookies = {
    get(key) {
        return c.get(key)?.value
    },
}
const httpOpts = getServerHttpCookies(mycookie)
console.log('----httpOpts >>>', httpOpts)
const icms = new ICMSServer(httpOpts);


// 定义获取数据的函数，可以在多个地方复用
export async function getWebsiteData() {
    return icms.loadWebsite();
}