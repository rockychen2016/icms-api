import {ICMS} from '@icms-api/server'
export default async function Home() {
  const icms = new ICMS();
  const model = await icms.loadWebsite();
  return (
    <div>
      {
        JSON.stringify(model)
      }
    </div>
  );
}
