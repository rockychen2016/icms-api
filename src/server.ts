import { HttpClient, HttpClientOpts, USER_TYPE_MAP } from 'iboot-http-client';
import { I18NWebsite, Webchannel, WebSite, WebsiteInfo } from './types/site';

export type ICMSOpts = Omit<HttpClientOpts, 'userType'>

const baseUrl = {
    "site": "guest/site/",
    "shop": "guest/site/shop/"
}

export class ICMS {
    private readonly http: HttpClient;
    constructor(opts?: Readonly<ICMSOpts>) {
        this.http = new HttpClient({
            "deviceId": opts?.deviceId,
            "lang": opts?.lang,
            "websiteId": opts?.websiteId,
            "websiteNo": opts?.websiteNo,
            "userType": USER_TYPE_MAP.TYPE_C,
            "helloURL": "guest/site/helloIBoot",
        })
        console.log("env >>> ", process.env.NODE_ENV)
    }
    /**
     * 获取言语网站列表
     * @returns I18NWebsite[]
     */
    async loadI18nList():Promise<Array<I18NWebsite>> {
        const url = baseUrl.site + "i18nList";
        const res = await this.http.get<Array<I18NWebsite>>({url:url});
        if(res.success){
            return res.data??[]
        }
        return []
    }

    /**
     * 获取网站信息
     * @param params {showNav:是否拉取网站导航菜单,showFriendLink:是否拉取首页有情链接sortBy升序前20个}
     * @returns 
     */
    async loadWebsite(params?: Readonly<{ showNav?: boolean, showFriendLink?: boolean }>): Promise<WebsiteInfo | undefined> {
        const url = baseUrl.site + "currentWebSite";
        const res = await this.http.get<WebSite>({ url: url, data: { "showNav": params?.showNav ?? 'true', "showFriendLink": params?.showFriendLink ?? 'false' } });
        if (res.success) {
            const result: WebsiteInfo = {
                "website": res.data!,
                "i18nSites": await this.loadI18nList()
            }
            return result;
        }
        throw Error(res.msg)
    }

    /**
     * 获取栏目channelNo下的子栏目列表
     * @param params {channelNo?:栏目编号(不传从顶及栏目开始), showChildren?:是否同时获取下级栏目的子栏目}
     * @returns 
     */

    async loadChannels(params?: Readonly<{ channelNo?: string, showChildren?: boolean }>): Promise<Array<Webchannel>> {
        const url = baseUrl.site + "getChannelListByNo";
        const res = await this.http.get<Array<Webchannel>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? []
        }
        return [];
    }

    /**
     * 通过channelId获取栏目信息,showChildren为true时同时获取它的下级栏目
     * @param params 
     * @returns 
     */
    async loadChannelById(params: Readonly<{ channelId: string, showChildren?: boolean }>): Promise<Webchannel | undefined> {
        const url = baseUrl.site + "getChannelById";
        const res = await this.http.get<Webchannel>({ url, data: { ...params } });
        if (res.success) {
            return res.data
        }
    }
    /**
     * 通过channelNo获取栏目信息,showChildren为true时同时获取它的下级栏目
     * @param params 
     * @returns 
     */
    async loadChannelByNo(params: Readonly<{ channelNo: string, showChildren?: boolean }>): Promise<Webchannel | undefined> {
        const url = baseUrl.site + 'getChannelByNo';
        const res = await this.http.get<Webchannel>({ url: url, data: { ...params } });
        if(res.success){
            return res.data;
        }
    }

        /**
     * 通过uri(如'/about')获取栏目信息,showChildren为true时同时获取它的下级栏目
     * @param params 
     * @returns 
     */
    async loadChannelByUri(params: Readonly<{ uri: string, showChildren?: boolean }>): Promise<Array<Webchannel>> {
        const url = baseUrl.site + "getChannelByUrl";
        const res = await this.http.get<Array<Webchannel>>({ url, data: { ...params } });
        if (res) {
            return res.data ?? []
        }
        return []
    }


}