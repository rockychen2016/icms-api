import { ICMSServer } from '@icms-api/server'
import { Metadata } from 'next';

const icms = new ICMSServer();

// 方案1：使用共享的数据获取函数 + generateMetadata
// 这是解决重复获取问题的最佳方案

// 定义共享的数据获取函数
async function fetchWebsiteData() {
  console.log('Fetching website data...');
  return await icms.loadWebsite();
}

// 使用 generateMetadata 获取数据用于 metadata
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchWebsiteData();
  return {
    title: data?.metadata?.title || 'Demo Page',
    description: data?.metadata?.description || 'Demo page description',
    // 可以添加其他metadata字段
  };
}

export default async function DemoPage() {
  // 在Page组件中获取数据，Next.js会智能地复用generateMetadata中已经获取的数据
  // 避免重复获取
  const data = await fetchWebsiteData();
  
  return (
    <div>
      <h1>Demo Page - 避免重复数据获取的最佳实践</h1>
      <div>
        <h2>数据内容：</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

// 方案2：如果需要不同的数据获取方式
// async function fetchChannels() {
//   return await icms.loadChannels({ showChildren: true });
// }

// export async function generateMetadata(): Promise<Metadata> {
//   const channels = await fetchChannels();
//   const firstChannel = channels?.[0];
//   return {
//     title: firstChannel?.title || 'Channels Page',
//     description: firstChannel?.description || 'Channels page description',
//   };
// }

// export default async function ChannelsPage() {
//   const channels = await fetchChannels();
//   return (
//     <div>
//       <h1>Channels</h1>
//       <ul>
//         {channels?.map(channel => (
//           <li key={channel.id}>{channel.title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
