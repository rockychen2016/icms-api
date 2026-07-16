import { ICMSServer } from "@icms-api/server";
import { cookies } from "next/headers";

// 定义获取数据的函数，可以在多个地方复用
const c = await cookies();
export const icms = new ICMSServer({
    get(key) {
        return c.get(key)?.value;
    },
});