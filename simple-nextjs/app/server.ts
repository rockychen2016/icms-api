import { ICMSServer } from "@icms-api/server";
import { IStorage } from "@rock.chen/icms-http-client";
import { headers } from "next/headers";

// 定义获取数据的函数，可以在多个地方复用
const header = await headers();
const headerStorage: IStorage = {
    get(key) {
        const value = header.get(key);
        console.log(`read >>> ${key}=${value}`);
        return value;
    },
}
export const icms = new ICMSServer({
    headerStorage
});