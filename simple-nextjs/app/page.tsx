import {ICMS} from '@icms-api/server'
export default async function Home() {
  const icms = new ICMS();
  const model = await icms.loadWebsite();
  //const model = await icms.loadChannels({showChildren:true});
  //const model = await icms.loadChannelByUri({uri:'/about', showChildren:true})
  //const model = await icms.loadChannelById({channelId:'C84291753196261376'})
  //const model = await icms.loadProductPageInfo({pageNo:1, pageSize:20})
  return (
    <div>
      {
        JSON.stringify(model)
      }
    </div>
  );
}
