import { HttpClient, HttpClientOpts, USER_TYPE_MAP } from 'iboot-http-client';
import { I18NWebsite, WebSite } from './types/site';

export type ICMSWebsiteOpts = Omit<HttpClientOpts,'userType'>

const baseUrl = {
    "site":"guest/site/",
    "shop":"guest/site/shop/"
}

export class ICMSWebsite{
    private readonly http:HttpClient;
    private i18nList:Array<I18NWebsite> = [];
    constructor({deviceId, lang, websiteId, websiteNo}:Readonly<ICMSWebsiteOpts>){
        this.http = new HttpClient({
            "deviceId":deviceId,
            "lang":lang,
            "websiteId":websiteId,
            "websiteNo":websiteNo,
            "userType":USER_TYPE_MAP.TYPE_C,
            "helloURL":"guest/site/helloIBoot"
        })
        const url = baseUrl.site + "i18nList";
        const _self = this;
        this.http.get<Array<I18NWebsite>>({url:url}).then(res=>{
            if(res.success){
                _self.i18nList=[...res.data??[]];
                return;
            }
        });
    }
    /**
     * 获取言语网站列表
     * @returns I18NWebsite[]
     */
    getI18nList(){
        return this.i18nList;
    }

    async loadWebsiteInfo(){
        const url = baseUrl.site + "currentWebSite";
        return await this.http.get<WebSite>({url:url});
    }

}