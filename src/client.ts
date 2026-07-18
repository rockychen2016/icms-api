import type { Member, FriendLink, LinkGroup, I18NWebsite, Webchannel, WebsiteInfo } from "./types/site"
import type { ProductContent } from "./types/cms-product"
import type { PageInfo, PageParams } from "./types/cms-base"
import type { NewsContent } from "./types/cms-news"
import type { Reviews, SubscribeUser, ContactUs } from "./types/cms-message"
import type { SpecDescription } from "./types/cms-mall"
import { getLoginUser, ICookies, iGet, iPost, iPostSuccess } from "@rock.chen/icms-http-client"


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
}

export const icmsClient = new ICMSClient()
