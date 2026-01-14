import { HttpClient, ICookies, IStorage, ServerHttpOpts, setServerHttpCookies, setServerHttpHeaders, USER_TYPE_MAP } from 'iboot-http-client';
import { I18NWebsite, Webchannel, WebSite, WebsiteInfo } from './types/site';
import { ProductContent } from './types/cms-product';
import { PageInfo, PageParams } from './types/cms-base';
import { NewsContent } from './types/cms-news';
import { Reviews } from './types/cms-message';

const baseUrl = {
    "site": "guest/site/",
    "shop": "guest/site/shop/"
}

const buildEmptyPageInfo = <T>({ pageNo, pageSize }: { pageNo: number, pageSize: number }): PageInfo<T> => {
    return {
        "total": 0,
        "pageNo": pageNo,
        "pageSize": pageSize,
        "pageCount": 0,
        "first": true,
        "last": true,
        "content": [],
    }
}

export class ICMSServer {
    private readonly http: HttpClient;
    constructor(opts?: Readonly<ServerHttpOpts>) {
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

    //#region ----网站及栏目
    /**
     * 给要访问的网站打招呼，以获取网站相关请求头,该方法通常放在中间件或proxy中
     * @param store 
     */
    async helloWebsite(store?: Readonly<{ storage?: IStorage, cookies?: ICookies }>) {
        const url = baseUrl.site + "helloWebsite";
        const res = await this.http.get({ url: url });
        if (res.success) {
            const headers = res.headers;
            if (store && headers) {
                const deviceId = headers['device-id'];
                const lang = headers["lang"];
                const websiteId = headers['web-id'];
                const websiteNo = headers["web-no"];
                const values: Omit<ServerHttpOpts, 'userType' | 'helloURL'> = {}
                if (deviceId && deviceId.length > 0) {
                    values['deviceId'] = deviceId
                }
                if (lang && lang.length > 0) {
                    values['lang'] = lang
                }
                if (websiteId && websiteId.length > 0) {
                    values['websiteId'] = websiteId
                }
                if (websiteNo && websiteNo.length > 0) {
                    values['websiteNo'] = websiteNo
                }
                if (store.cookies && store.cookies.set) {
                    setServerHttpCookies(store.cookies, values);

                } else if (store.storage && store.storage.set) {
                    setServerHttpHeaders(store.storage, values);
                }
            }
        }
    }
    /**
     * 获取言语网站列表
     * @returns I18NWebsite[]
     */
    async loadI18nList(): Promise<Array<I18NWebsite>> {
        const url = baseUrl.site + "i18nList";
        const res = await this.http.get<Array<I18NWebsite>>({ url: url });
        if (res.success) {
            return res.data ?? []
        }
        return []
    }

    /**
     * 获取网站信息
     * @param params {showNav:是否拉取网站导航菜单(默认为true),showFriendLink:是否拉取首页有情链接sortBy升序前20个}
     * @returns 
     */
    async loadWebsite(params?: Readonly<{ showNav?: boolean, showFriendLink?: boolean, showI18NList?: boolean }>): Promise<WebsiteInfo> {
        const url = baseUrl.site + "currentWebSite";
        const res = await this.http.get<WebSite>({ url: url, data: { "showNav": params?.showNav ?? 'true', "showFriendLink": params?.showFriendLink ?? 'false' } });
        if (res.success) {
            const website = res.data!;
            const seo = website.seoProps;
            const result: WebsiteInfo = {
                "website": website!,
                "metadata": {
                    "title": seo?.title,
                    "description": seo?.description,
                    "keywords": seo?.keywords,
                    "authors": {
                        "url": "https://www.icms.xin",
                        "name": "iCMS"
                    }
                },
                "i18nSites": params?.showI18NList ? await this.loadI18nList() : []
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
        throw new Error(res.msg)
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
        throw new Error(res.msg)
    }
    /**
     * 通过channelNo获取栏目信息,showChildren为true时同时获取它的下级栏目
     * @param params 
     * @returns 
     */
    async loadChannelByNo(params: Readonly<{ channelNo: string, showChildren?: boolean }>): Promise<Webchannel | undefined> {
        const url = baseUrl.site + 'getChannelByNo';
        const res = await this.http.get<Webchannel>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data;
        }
        throw new Error(res.msg)
    }

    /**
     * 通过uri(如'/about')获取栏目信息,showChildren为true时同时获取它的下级栏目
     * @param params 
     * @returns 
     */
    async loadChannelByUri(params: Readonly<{ uri: string, showChildren?: boolean }>): Promise<Webchannel | undefined> {
        const url = baseUrl.site + "getChannelByUrl";
        const res = await this.http.get<Webchannel>({ url, data: { ...params } });
        if (res.success) {
            return res.data;
        }
        throw new Error(res.msg)
    }
    //#endregion

    //#region ----产品内容
    /**
     * 获取产品详情
     * @param proId 
     * @returns 
     */
    async loadProductDetail(proId: string): Promise<ProductContent | undefined> {
        const url = baseUrl.site + 'getProduct';
        const res = await this.http.get<ProductContent>({ url, data: { "proId": proId } });
        if (res.success) {
            return res.data;
        }
        throw new Error(res.msg)
    }

    /**
     * 按分页获取产品内容列表
     * @param params {channelId指定栏目下的产品,为空则不限,keyword:关键字查询}
     * @returns 
     */
    async loadProductPageInfo(params: Readonly<{ channelId?: string, keyword?: string } & PageParams>): Promise<PageInfo<ProductContent>> {
        const url = baseUrl.site + 'searchProductForPage';
        const res = await this.http.get<PageInfo<ProductContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? buildEmptyPageInfo<ProductContent>({ pageNo: params.pageNo, pageSize: params.pageSize });
        }
        throw new Error(res.msg)
    }

    /**
     * 按分组获取产品内容列表PageInfo
     * @param params {groupId:分组ID}
     * @returns 
     */
    async loadProductPageInfoByGroup(params: Readonly<{ groupId: string } & PageParams>): Promise<PageInfo<ProductContent>> {
        const url = baseUrl.site + 'searchProductForPageByGroup';
        const res = await this.http.get<PageInfo<ProductContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? buildEmptyPageInfo<ProductContent>({ pageNo: params.pageNo, pageSize: params.pageSize })
        }
        throw new Error(res.msg)
    }

    /**
     * 按分组获取产品内容列表
     * @param params 
     * @returns 
     */
    async loadProductListByGroupId(params: Readonly<{ groupId: string }>): Promise<Array<ProductContent>> {
        const url = baseUrl.site + 'searchProductByGroup';
        const res = await this.http.get<Array<ProductContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? [];
        }
        throw new Error(res.msg)
    }
    //#endregion

    //#region ----图文内容
    /**
     * 获取图文详情
     * @param newId 
     * @returns 
     */
    async loadNewsDetail(newId: string): Promise<NewsContent | undefined> {
        const url = baseUrl.site + 'getNewsDetail';
        const res = await this.http.get<NewsContent>({ url: url, data: { "newId": newId } });
        if (res.success) {
            return res.data;
        }
        throw new Error(res.msg)
    }

    /**
     * 分页获取图文列表
     * @param params {channelNo?:指定栏目的内容, keyword?:关键字查询, pageNo:页码, pageSize:每页记录数, sortBy?:指定排序字段, sort?:排序方向'ASC' | 'DESC'}
     * @returns 
     */
    async loadNewsPageInfo(params: Readonly<{ channelNo?: string, keyword?: string } & PageParams>): Promise<PageInfo<NewsContent>> {
        const url = baseUrl.site + 'searchNewsForPage';
        const res = await this.http.get<PageInfo<NewsContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? buildEmptyPageInfo<NewsContent>({ pageNo: params.pageNo, pageSize: params.pageSize });
        }
        throw new Error(res.msg)
    }

    /**
     * 依组ID分页获取图文列表
     * @param params {groupId:组ID}
     * @returns 
     */
    async loadNewsPageInfoByGroupId(params: Readonly<{ groupId: string } & PageParams>): Promise<PageInfo<NewsContent>> {
        const url = baseUrl.site + 'searchNewsForPageByGroup';
        const res = await this.http.get<PageInfo<NewsContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? buildEmptyPageInfo({ pageNo: params.pageNo, pageSize: params.pageSize });
        }
        throw new Error(res.msg);
    }

    /**
     * 依组ID获取图文列表
     * @param params 
     * @returns 
     */
    async loadNewsListByGroupId(params: Readonly<{ groupId: string }>): Promise<Array<NewsContent>> {
        const url = baseUrl.site + 'searchNewsByGroup';
        const res = await this.http.get<Array<NewsContent>>({ url, data: { ...params } });
        if (res.success) {
            return res.data ?? []
        }
        throw new Error(res.msg);
    }
    //#endregion

    //#region ----相册内容

    //#region 

    //#region ----视频内容

    //#endregion

    //#region ----活动内容

    //#endregion

    //#region ----订阅、评论、留言
    async loadReviewList(params: Readonly<{ entityNo?: string, rowCount?: string }>): Promise<Array<Reviews>> {
        const url = baseUrl.site + 'getReviewList';
        const res = await this.http.get<Array<Reviews>>({ url: url, data: { ...params, rowCount: params.rowCount ?? 20 } });
        if (res.success) {
            return res.data ?? []
        }
        throw new Error(res.msg);
    }


    //#endregion

}