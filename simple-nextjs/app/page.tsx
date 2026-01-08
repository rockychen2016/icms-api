import {ICMSWebsite} from '@icms-api/server'
export default async function Home() {
  const website = new ICMSWebsite({});
  const model = await website.loadWebsiteInfo();
  return (
    <div>
      {
        JSON.stringify(model)
      }
    </div>
  );
}
