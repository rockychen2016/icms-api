import type { Member, FriendLink, LinkGroup, I18NWebsite, Webchannel, WebsiteInfo } from "./types/site"
import type { ProductContent } from "./types/cms-product"
import type { PageInfo, PageParams } from "./types/cms-base"
import type { NewsContent } from "./types/cms-news"
import type { PhotoContent } from "./types/cms-photo"
import type { VideoContent } from "./types/cms-video"
import type { ActivityContent } from "./types/cms-activity"
import type { Reviews, SubscribeUser, ContactUs } from "./types/cms-message"
import type { SpecDescription, GoodsItem, GoodsCategory, GoodsTag } from "./types/cms-mall"
import { getLoginUser, ICookies, iGet, iPost, iPostSuccess } from "./client-helper"


export class ICMSClient {
    private cookies: ICookies | null = null

    constructor() {
    }

    setICookies(c: ICookies): ICMSClient {
        this.cookies = c;
        return this;
    }

    // ========== 用户认证 ==========

    async login({ username, password }: Readonly<{ username: string, password: string }>): Promise<Member | undefined> {
        await iPost('login', {
            data: { username, password }
        })
        if (this.cookies) {
            return getLoginUser(this.cookies)
        }
        return undefined
    }

    async logout(): Promise<void> {
        await iPost('logout');
    }

    // ========== 网站信息 ==========

    async loadI18nList(): Promise<Array<I18NWebsite>> {
        return (await iGet<Array<I18NWebsite>>("loadI18nList")) ?? []
    }

    async loadWebsite(params?: Readonly<{ showNav?: boolean; showFriendLink?: boolean; showI18NList?: boolean }>): Promise<WebsiteInfo | undefined> {
        const data: Record<string, string> = {
            showNav: String(params?.showNav ?? true),
            showFriendLink: String(params?.showFriendLink ?? false),
        }
        return iGet<WebsiteInfo>("loadWebsite", data)
    }

    async loadChannels(params?: Readonly<{ channelNo?: string; showChildren?: boolean }>): Promise<Array<Webchannel>> {
        const data: Record<string, string> = {}
        if (params?.channelNo) data.channelNo = params.channelNo
        if (params?.showChildren !== undefined) data.showChildren = String(params.showChildren)
        return (await iGet<Array<Webchannel>>("loadChannels", data)) ?? []
    }

    async loadChannelById(params: Readonly<{ channelId: string; showChildren?: boolean }>): Promise<Webchannel | undefined> {
        const data: Record<string, string> = { channelId: params.channelId }
        if (params.showChildren !== undefined) data.showChildren = String(params.showChildren)
        return iGet<Webchannel>("loadChannelById", data)
    }

    async loadChannelByNo(params: Readonly<{ channelNo: string; showChildren?: boolean }>): Promise<Webchannel | undefined> {
        const data: Record<string, string> = { channelNo: params.channelNo }
        if (params.showChildren !== undefined) data.showChildren = String(params.showChildren)
        return iGet<Webchannel>("loadChannelByNo", data)
    }

    async loadChannelByUri(params: Readonly<{ uri: string; showChildren?: boolean }>): Promise<Webchannel | undefined> {
        const data: Record<string, string> = { uri: params.uri }
        if (params.showChildren !== undefined) data.showChildren = String(params.showChildren)
        return iGet<Webchannel>("loadChannelByUri", data)
    }

    // ========== 产品 ==========

    async loadProductDetail(proId: string): Promise<ProductContent | undefined> {
        return iGet<ProductContent>("loadProductDetail", { data: { proId } })
    }

    async loadProductPageInfo(params: Readonly<{ channelId?: string; keyword?: string } & PageParams>): Promise<PageInfo<ProductContent> | undefined> {
        return iGet<PageInfo<ProductContent>>("loadProductPageInfo", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }

    async loadProductPageInfoByGroup(params: Readonly<{ groupId: string } & PageParams>): Promise<PageInfo<ProductContent> | undefined> {
        return iGet<PageInfo<ProductContent>>("loadProductPageInfoByGroup", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }

    async loadProductListByGroupId(params: Readonly<{ groupId: string }>): Promise<Array<ProductContent>> {
        return (await iGet<Array<ProductContent>>("loadProductListByGroupId", { data: { groupId: params.groupId } })) ?? []
    }

    // ========== 图文 ==========

    async loadNewsDetail(newId: string): Promise<NewsContent | undefined> {
        return iGet<NewsContent>("loadNewsDetail", { data: { newId } })
    }

    async loadNewsPageInfo(params: Readonly<{ channelNo?: string; keyword?: string } & PageParams>): Promise<PageInfo<NewsContent> | undefined> {
        return iGet<PageInfo<NewsContent>>("loadNewsPageInfo", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }

    async loadNewsPageInfoByGroupId(params: Readonly<{ groupId: string } & PageParams>): Promise<PageInfo<NewsContent> | undefined> {
        return iGet<PageInfo<NewsContent>>("loadNewsPageInfoByGroupId", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }

    async loadNewsListByGroupId(params: Readonly<{ groupId: string }>): Promise<Array<NewsContent>> {
        return (await iGet<Array<NewsContent>>("loadNewsListByGroupId", { data: { groupId: params.groupId } })) ?? []
    }

    // ========== 相册 ==========

    async loadPhotoDetail(photoId: string): Promise<PhotoContent | undefined> {
        return iGet<PhotoContent>("loadPhotoDetail", { data: { photoId } })
    }

    async loadPhotoPageInfo(params: Readonly<{ channelNo?: string; keyword?: string } & PageParams>): Promise<PageInfo<PhotoContent> | undefined> {
        return iGet<PageInfo<PhotoContent>>("loadPhotoPageInfo", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }

    async loadPhotoPageInfoByGroup(params: Readonly<{ groupId: string } & PageParams>): Promise<PageInfo<PhotoContent> | undefined> {
        return iGet<PageInfo<PhotoContent>>("loadPhotoPageInfoByGroup", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }

    async loadPhotoListByGroupId(params: Readonly<{ groupId: string }>): Promise<Array<PhotoContent>> {
        return (await iGet<Array<PhotoContent>>("loadPhotoListByGroupId", { data: { groupId: params.groupId } })) ?? []
    }

    // ========== 视频 ==========

    async loadVideoDetail(videoId: string): Promise<VideoContent | undefined> {
        return iGet<VideoContent>("loadVideoDetail", { data: { videoId } })
    }

    async loadVideoPageInfo(params: Readonly<{ channelNo?: string; keyword?: string } & PageParams>): Promise<PageInfo<VideoContent> | undefined> {
        return iGet<PageInfo<VideoContent>>("loadVideoPageInfo", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }

    async loadVideoPageInfoByGroup(params: Readonly<{ groupId: string } & PageParams>): Promise<PageInfo<VideoContent> | undefined> {
        return iGet<PageInfo<VideoContent>>("loadVideoPageInfoByGroup", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }

    async loadVideoListByGroupId(params: Readonly<{ groupId: string }>): Promise<Array<VideoContent>> {
        return (await iGet<Array<VideoContent>>("loadVideoListByGroupId", { data: { groupId: params.groupId } })) ?? []
    }

    // ========== 活动 ==========

    async loadActivityDetail(activityId: string): Promise<ActivityContent | undefined> {
        return iGet<ActivityContent>("loadActivityDetail", { data: { activityId } })
    }

    async loadActivityPageInfo(params: Readonly<{ channelNo?: string; keyword?: string } & PageParams>): Promise<PageInfo<ActivityContent> | undefined> {
        return iGet<PageInfo<ActivityContent>>("loadActivityPageInfo", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }

    async loadActivityPageInfoByGroup(params: Readonly<{ groupId: string } & PageParams>): Promise<PageInfo<ActivityContent> | undefined> {
        return iGet<PageInfo<ActivityContent>>("loadActivityPageInfoByGroup", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }

    async loadActivityListByGroupId(params: Readonly<{ groupId: string }>): Promise<Array<ActivityContent>> {
        return (await iGet<Array<ActivityContent>>("loadActivityListByGroupId", { data: { groupId: params.groupId } })) ?? []
    }

    // ========== 评论/订阅/联系 ==========

    async loadReviewList(params: Readonly<{ entityNo?: string; rowCount?: string }>): Promise<Array<Reviews>> {
        return (await iGet<Array<Reviews>>("loadReviewList", { data: { ...params } })) ?? []
    }

    async submitComment(data: Readonly<Partial<Reviews>>): Promise<boolean> {
        return await iPostSuccess("submitComment", data as Record<string, any>)
    }

    async subscribe(data: Readonly<Pick<SubscribeUser, 'email'> & Partial<Pick<SubscribeUser, 'nickname'>>>): Promise<boolean> {
        return await iPostSuccess("subscribe", data as Record<string, any>)
    }

    async submitContactUs(data: Readonly<Partial<ContactUs>>): Promise<boolean> {
        return await iPostSuccess("submitContactUs", data as Record<string, any>)
    }

    // ========== 友链 ==========

    async loadLinkGroups(): Promise<Array<LinkGroup>> {
        return (await iGet<Array<LinkGroup>>("loadLinkGroups")) ?? []
    }

    async loadFriendLinks(count?: number): Promise<Array<FriendLink>> {
        return (await iGet<Array<FriendLink>>("loadFriendLinks", { data: count ? { count: String(count) } : {} })) ?? []
    }

    async submitLink(data: Readonly<Pick<FriendLink, 'name' | 'url'> & Partial<Pick<FriendLink, 'description'>>>): Promise<boolean> {
        return await iPostSuccess("submitLink", data as Record<string, any>)
    }

    // ========== 商城 ==========

    async getSpecDescription(code: string): Promise<SpecDescription | undefined> {
        return iGet<SpecDescription>("getSpecDescription", { data: { code } })
    }

    /** 获取商品标签字典 */
    async loadGoodsTagList(): Promise<Array<GoodsTag>> {
        return (await iGet<Array<GoodsTag>>("getGoodsTagList")) ?? []
    }

    /** 获取所有货架（类目）列表 */
    async loadGoodsShelves(): Promise<Array<GoodsCategory>> {
        return (await iGet<Array<GoodsCategory>>("getGoodsShelves")) ?? []
    }

    /** 获取指定货架的商品列表 */
    async loadCategoryGoods(params?: Readonly<{ cateCode: string; count?: number }>): Promise<Array<GoodsItem>> {
        const data: Record<string, string> = {}
        if (params?.cateCode) data.cateCode = params.cateCode
        if (params?.count !== undefined) data.count = String(params.count)
        return (await iGet<Array<GoodsItem>>("getCategoryGoods", { data })) ?? []
    }

    /** 分页搜索商品 */
    async searchGoods(params: Readonly<{ cateCode?: string; keyword?: string } & PageParams>): Promise<PageInfo<GoodsItem> | undefined> {
        return iGet<PageInfo<GoodsItem>>("searchGoods", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }
}

export const icmsClient = new ICMSClient()
