// import { HTTPRouter, NuxtJsAdapter, ResultModel, USER_TYPE_MAP } from "iboot-http-client";
 import { H3Event } from 'h3';

import { HTTPRouter, NuxtJsAdapter, ResultModel, USER_TYPE_MAP } from "iboot-http-client";

// export default eventHandler(event=>{
//   console.log("xxxx");
//   return 'xxx'
// })



export default defineEventHandler(async (event) => {
  // const url = getRequestURL(event);
  // return {
  //   url:url,
  //   headers:getHeaders(event)
  // };

  const cookies = parseCookies(event);
  const headers = getHeaders(event);
  const res = new HTTPRouter({
    "config": {
      "userType": USER_TYPE_MAP.TYPE_B,
      "APIMAP": {},
      "helloURL": 'guest/site/helloIBoot'
    },
    "adapter": new NuxtJsAdapter(),
    "storage": {
      "headers": {
        get(key: string) {
          return headers[key];
        },
        set(key: string, value: string) {
          event.node.req.headers[key] = value
        },
      },
      "cookies": {
        get(key: string) {
          return cookies[key];
        },
      }
    }
  });
  return await res.handleRequest<H3Event, ResultModel<any>>(event);
})