import { HttpClient, HttpClientOpts, USER_TYPE_MAP } from 'iboot-http-client';
import { I18NWebsite, WebSite, WebsiteInfo } from './types/site';

export type ICMSOpts = Omit<HttpClientOpts, 'userType'>

const baseUrl = {
    "site": "guest/site/",
    "shop": "guest/site/shop/"
}

export class ICMS {
    private readonly http: HttpClient;
    private i18nList: Array<I18NWebsite> = [];
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
        const url = baseUrl.site + "i18nList";
        const _self = this;
        this.http.get<Array<I18NWebsite>>({ url: url }).then(res => {
            if (res.success) {
                _self.i18nList = [...res.data ?? []];
                return;
            }
        });
    }
    /**
     * 获取言语网站列表
     * @returns I18NWebsite[]
     */
    getI18nList() {
        return this.i18nList;
    }

    async loadWebsite(params?: Readonly<{ showNav?: boolean, showFriendLink?: boolean }>) {
        const url = baseUrl.site + "currentWebSite";
        const res = await this.http.get<WebSite>({ url: url, data: { "showNav": params?.showNav ?? 'true', "showFriendLink": params?.showFriendLink ?? 'false' } });
        if (res.success) {
            const result: WebsiteInfo = {
                "website": res.data!,
                "i18nSites": this.i18nList
            }
            return result;
        }
        throw Error(res.msg)
    }
}