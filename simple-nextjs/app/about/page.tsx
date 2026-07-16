import { ICMSServer } from "@icms-api/server";
import { IStorage } from "@rock.chen/icms-http-client";
import { headers } from "next/headers";

const head = await headers();
const headerStorage: IStorage = {
  get(key) {
    return head.get(key);
  },
}
const icms = new ICMSServer({ headerStorage });

// 定义获取数据的函数
async function getChannelData() {
  return await icms.loadChannelByUri({ uri: '/about', showChildren: true });
}

// 如果需要metadata，可以添加generateMetadata函数
// export async function generateMetadata(): Promise<Metadata> {
//   const channel = await getChannelData();
//   return {
//     title: channel?.title || 'About Page',
//     description: channel?.description || 'About page description',
//   };
// }

export default async function Page() {
  // 在Page组件内部获取数据，每次请求都会重新获取
  const channel = await getChannelData();
  const content = channel?.children ?? [];

  return (
    content.length > 0 ? <div>{JSON.stringify(content[0])}</div> : null
  );
}
