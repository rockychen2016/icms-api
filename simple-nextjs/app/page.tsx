import { Metadata } from 'next';
import { icms } from './server';

// 使用 generateMetadata 获取数据用于 metadata
export async function generateMetadata(): Promise<Metadata> {
  const model = await icms.loadWebsite();
  return model?.metadata ?? {};
}

export default async function Home() {
  // 在 Page 组件中获取数据，每次请求都会重新获取
  const model = await icms.loadWebsite();

  // 如果需要其他数据获取方式，可以在这里调用
  // const channels = await icms.loadChannels({showChildren:true});
  // const channel = await icms.loadChannelByUri({uri:'/about', showChildren:true});
  // const channelById = await icms.loadChannelById({channelId:'C84291753196261376'});
  // const products = await icms.loadProductPageInfo({pageNo:1, pageSize:20});

  return (
    <div>
      {
        JSON.stringify(model)
      }
    </div>
  );
}
