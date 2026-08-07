import { getServerHttpCookies, HttpClient, ICookies, ServerHttpOpts, setServerHttpCookies, USER_TYPE_MAP } from "@rock.chen/icms-http-client";
import { I18NWebsite, Webchannel, WebSite, WebsiteInfo, FriendLink, LinkGroup } from './types/site';
import { ProductContent } from './types/cms-product';
import { PageInfo, PageParams } from './types/cms-base';
import { NewsContent } from './types/cms-news';
import { PhotoContent } from './types/cms-photo';
import { VideoContent } from './types/cms-video';
import { ActivityContent } from './types/cms-activity';
import { Reviews, SubscribeUser, ContactUs } from './types/cms-message';
import { SpecDescription, GoodsItem, GoodsCategory, GoodsTag } from './types/cms-mall';

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

export const helloURL = `${baseUrl.site}helloIBoot`;

export class ICMSServer {
    private readonly http: HttpClient;
    constructor(cookies: Readonly<ICookies>) {
        let httpOpts = getServerHttpCookies(cookies);
        this.http = new HttpClient({
            ...httpOpts,
            userType: USER_TYPE_MAP.TYPE_C,
            helloURL
        })
    }

    //#region ----网站及栏目
    async helloWebsite(c: ICookies) {
        const url = baseUrl.site + "helloWebsite";
        const res = await this.http.get({ url: url });
        if (res.success) {
            const headers = res.headers;
            if (headers) {
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
                setServerHttpCookies(c, values);
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
    /**
     * 获取相册详情
     * @param photoId 
     * @returns 
     */
    async loadPhotoDetail(photoId: string): Promise<PhotoContent | undefined> {
        const url = baseUrl.site + 'getPhoto';
        const res = await this.http.get<PhotoContent>({ url, data: { "photoId": photoId } });
        if (res.success) {
            return res.data;
        }
        throw new Error(res.msg)
    }

    /**
     * 分页获取相册列表
     * @param params {channelNo?:指定栏目下的内容, keyword?:关键字查询, pageNo:页码, pageSize:每页记录数, sortBy?:指定排序字段, sort?:排序方向'ASC' | 'DESC'}
     * @returns 
     */
    async loadPhotoPageInfo(params: Readonly<{ channelNo?: string, keyword?: string } & PageParams>): Promise<PageInfo<PhotoContent>> {
        const url = baseUrl.site + 'searchPhotoForPage';
        const res = await this.http.get<PageInfo<PhotoContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? buildEmptyPageInfo<PhotoContent>({ pageNo: params.pageNo, pageSize: params.pageSize });
        }
        throw new Error(res.msg)
    }

    /**
     * 按分组分页获取相册列表
     * @param params {groupId:分组ID, pageNo:页码, pageSize:每页记录数, sortBy?:指定排序字段, sort?:排序方向'ASC' | 'DESC'}
     * @returns 
     */
    async loadPhotoPageInfoByGroup(params: Readonly<{ groupId: string } & PageParams>): Promise<PageInfo<PhotoContent>> {
        const url = baseUrl.site + 'searchPhotoForPageByGroup';
        const res = await this.http.get<PageInfo<PhotoContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? buildEmptyPageInfo<PhotoContent>({ pageNo: params.pageNo, pageSize: params.pageSize });
        }
        throw new Error(res.msg)
    }

    /**
     * 按分组获取相册列表
     * @param params 
     * @returns 
     */
    async loadPhotoListByGroupId(params: Readonly<{ groupId: string }>): Promise<Array<PhotoContent>> {
        const url = baseUrl.site + 'searchPhotoByGroup';
        const res = await this.http.get<Array<PhotoContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? [];
        }
        throw new Error(res.msg)
    }
    //#endregion

    //#region ----视频内容
    /**
     * 获取视频详情
     * @param videoId 
     * @returns 
     */
    async loadVideoDetail(videoId: string): Promise<VideoContent | undefined> {
        const url = baseUrl.site + 'getVideo';
        const res = await this.http.get<VideoContent>({ url, data: { "videoId": videoId } });
        if (res.success) {
            return res.data;
        }
        throw new Error(res.msg)
    }

    /**
     * 分页获取视频列表
     * @param params {channelNo?:指定栏目下的内容, keyword?:关键字查询, pageNo:页码, pageSize:每页记录数, sortBy?:指定排序字段, sort?:排序方向'ASC' | 'DESC'}
     * @returns 
     */
    async loadVideoPageInfo(params: Readonly<{ channelNo?: string, keyword?: string } & PageParams>): Promise<PageInfo<VideoContent>> {
        const url = baseUrl.site + 'searchVideoForPage';
        const res = await this.http.get<PageInfo<VideoContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? buildEmptyPageInfo<VideoContent>({ pageNo: params.pageNo, pageSize: params.pageSize });
        }
        throw new Error(res.msg)
    }

    /**
     * 按分组分页获取视频列表
     * @param params {groupId:分组ID, pageNo:页码, pageSize:每页记录数, sortBy?:指定排序字段, sort?:排序方向'ASC' | 'DESC'}
     * @returns 
     */
    async loadVideoPageInfoByGroup(params: Readonly<{ groupId: string } & PageParams>): Promise<PageInfo<VideoContent>> {
        const url = baseUrl.site + 'searchVideoForPageByGroup';
        const res = await this.http.get<PageInfo<VideoContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? buildEmptyPageInfo<VideoContent>({ pageNo: params.pageNo, pageSize: params.pageSize });
        }
        throw new Error(res.msg)
    }

    /**
     * 按分组获取视频列表
     * @param params 
     * @returns 
     */
    async loadVideoListByGroupId(params: Readonly<{ groupId: string }>): Promise<Array<VideoContent>> {
        const url = baseUrl.site + 'searchVideoByGroup';
        const res = await this.http.get<Array<VideoContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? [];
        }
        throw new Error(res.msg)
    }
    //#endregion

    //#region ----活动内容
    /**
     * 获取活动详情
     * @param activityId 
     * @returns 
     */
    async loadActivityDetail(activityId: string): Promise<ActivityContent | undefined> {
        const url = baseUrl.site + 'getActivity';
        const res = await this.http.get<ActivityContent>({ url, data: { "activityId": activityId } });
        if (res.success) {
            return res.data;
        }
        throw new Error(res.msg)
    }

    /**
     * 分页获取活动列表
     * @param params {channelNo?:指定栏目下的内容, keyword?:关键字查询, pageNo:页码, pageSize:每页记录数, sortBy?:指定排序字段, sort?:排序方向'ASC' | 'DESC'}
     * @returns 
     */
    async loadActivityPageInfo(params: Readonly<{ channelNo?: string, keyword?: string } & PageParams>): Promise<PageInfo<ActivityContent>> {
        const url = baseUrl.site + 'searchActivityForPage';
        const res = await this.http.get<PageInfo<ActivityContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? buildEmptyPageInfo<ActivityContent>({ pageNo: params.pageNo, pageSize: params.pageSize });
        }
        throw new Error(res.msg)
    }

    /**
     * 按分组分页获取活动列表
     * @param params {groupId:分组ID, pageNo:页码, pageSize:每页记录数, sortBy?:指定排序字段, sort?:排序方向'ASC' | 'DESC'}
     * @returns 
     */
    async loadActivityPageInfoByGroup(params: Readonly<{ groupId: string } & PageParams>): Promise<PageInfo<ActivityContent>> {
        const url = baseUrl.site + 'searchActivityForPageByGroup';
        const res = await this.http.get<PageInfo<ActivityContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? buildEmptyPageInfo<ActivityContent>({ pageNo: params.pageNo, pageSize: params.pageSize });
        }
        throw new Error(res.msg)
    }

    /**
     * 按分组获取活动列表
     * @param params 
     * @returns 
     */
    async loadActivityListByGroupId(params: Readonly<{ groupId: string }>): Promise<Array<ActivityContent>> {
        const url = baseUrl.site + 'searchActivityByGroup';
        const res = await this.http.get<Array<ActivityContent>>({ url: url, data: { ...params } });
        if (res.success) {
            return res.data ?? [];
        }
        throw new Error(res.msg)
    }
    //#endregion

    //#region ----订阅、评论、留言
    /**
     * 获取评论列表
     */
    async loadReviewList(params: Readonly<{ entityNo?: string, rowCount?: string }>): Promise<Array<Reviews>> {
        const url = baseUrl.site + 'getReviewList';
        const res = await this.http.get<Array<Reviews>>({ url: url, data: { ...params, rowCount: params.rowCount ?? 20 } });
        if (res.success) {
            return res.data ?? []
        }
        throw new Error(res.msg);
    }

    /**
     * 发表评论
     * @param data 评论数据
     */
    async submitComment(data: Readonly<Partial<Reviews>>): Promise<boolean> {
        const url = baseUrl.site + 'comment';
        const res = await this.http.post({ url, data: data as Record<string, any> });
        return res.success;
    }

    /**
     * 订阅
     * @param data 订阅数据 {email, nickname?}
     */
    async subscribe(data: Readonly<Pick<SubscribeUser, 'email'> & Partial<Pick<SubscribeUser, 'nickname'>>>): Promise<boolean> {
        const url = baseUrl.site + 'userSubscribe';
        const res = await this.http.post({ url, data: data as Record<string, any> });
        return res.success;
    }

    /**
     * 联系我们留言
     * @param data 留言数据
     */
    async submitContactUs(data: Readonly<Partial<ContactUs>>): Promise<boolean> {
        const url = baseUrl.site + 'contactUs';
        const res = await this.http.post({ url, data: data as Record<string, any> });
        return res.success;
    }
    //#endregion

    //#region ----友情链接
    /**
     * 获取链接分组列表（含友链）
     */
    async loadLinkGroups(): Promise<Array<LinkGroup>> {
        const url = baseUrl.site + 'getLinkGroupList';
        const res = await this.http.get<Array<LinkGroup>>({ url });
        if (res.success) {
            return res.data ?? [];
        }
        throw new Error(res.msg);
    }

    /**
     * 获取友情链接列表
     * @param count 获取数量，不传则全部
     */
    async loadFriendLinks(count?: number): Promise<Array<FriendLink>> {
        const url = baseUrl.site + 'getFriendLinks';
        const res = await this.http.get<Array<FriendLink>>({ url, data: count ? { count: String(count) } : undefined });
        if (res.success) {
            return res.data ?? [];
        }
        throw new Error(res.msg);
    }

    /**
     * 申请添加友链
     * @param data 友链数据 {name, url, description?}
     */
    async submitLink(data: Readonly<Pick<FriendLink, 'name' | 'url'> & Partial<Pick<FriendLink, 'description'>>>): Promise<boolean> {
        const url = baseUrl.site + 'addLink';
        const res = await this.http.post({ url, data: data as Record<string, any> });
        return res.success;
    }
    //#endregion

    //#region ----商城
    /**
     * 获取商品规格描述
     * @param code 规格编码
     */
    async getSpecDescription(code: string): Promise<SpecDescription | undefined> {
        const url = baseUrl.shop + 'getSpecDescription';
        const res = await this.http.get<SpecDescription>({ url, data: { code } });
        if (res.success) {
            return res.data;
        }
        throw new Error(res.msg);
    }

    /** 获取商品标签字典 */
    async loadGoodsTagList(): Promise<Array<GoodsTag>> {
        const url = baseUrl.shop + 'getGoodsTagList';
        const res = await this.http.get<Array<GoodsTag>>({ url });
        if (res.success) {
            return res.data ?? [];
        }
        throw new Error(res.msg);
    }

    /** 获取所有货架（类目）列表 */
    async loadGoodsShelves(): Promise<Array<GoodsCategory>> {
        const url = baseUrl.shop + 'getGoodsShelves';
        const res = await this.http.get<Array<GoodsCategory>>({ url });
        if (res.success) {
            return res.data ?? [];
        }
        throw new Error(res.msg);
    }

    /** 获取指定货架的商品列表 */
    async loadCategoryGoods(params: Readonly<{ cateCode: string; count?: number }>): Promise<Array<GoodsItem>> {
        const url = baseUrl.shop + 'getCategoryGoods';
        const res = await this.http.get<Array<GoodsItem>>({ url, data: { ...params } });
        if (res.success) {
            return res.data ?? [];
        }
        throw new Error(res.msg);
    }

    /** 分页搜索商品 */
    async searchGoods(params: Readonly<{ cateCode?: string; keyword?: string } & PageParams>): Promise<PageInfo<GoodsItem>> {
        const url = baseUrl.shop + 'searchGoods';
        const res = await this.http.get<PageInfo<GoodsItem>>({ url, data: { ...params } });
        if (res.success) {
            return res.data ?? buildEmptyPageInfo<GoodsItem>({ pageNo: params.pageNo, pageSize: params.pageSize });
        }
        throw new Error(res.msg);
    }
    //#endregion

}