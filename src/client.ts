import type { Member, FriendLink, LinkGroup, I18NWebsite, Webchannel, WebsiteInfo, MemberInfo, MemberAddress, OrderVO, OrderState } from "./types/site"
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
        // 浏览器端直接返回接口数据（token/user cookie 为 HttpOnly，前端无法读取）
        return await iPost<Member>('login', {
            data: { username, password }
        })
    }

    async logout(): Promise<void> {
        await iPost('logout');
    }

    // ========== 用户注册 ==========

    /**
     * 注册 C 端会员（手机号/邮箱 + 密码 + 邮箱验证码）
     * @param username 手机号或邮箱
     * @param password 密码
     * @param validateCode 邮箱验证码（发送验证码后填写）
     * @param nickname 昵称（可选）
     * @returns 注册成功且已登录时返回 Member，否则 undefined
     */
    async register({ username, password, validateCode, nickname }: Readonly<{ username: string, password: string, validateCode: string, nickname?: string }>): Promise<Member | undefined> {
        const result = await iPost<Member>('register', {
            data: { username, password, validateCode, nickname }
        })
        // register 接口通常只返回 "success"，若返回对象（Member）直接使用，否则交给页面 fallback 登录
        if (result && typeof result === 'object') {
            return result
        }
        if (this.cookies) {
            return getLoginUser(this.cookies)
        }
        return undefined
    }

    /**
     * 发送邮箱验证码（注册/找回密码用）
     * @param account 邮箱地址
     * @returns 是否发送成功
     */
    async sendVCode(account: string): Promise<boolean> {
        const result = await iPost<number>('sendcode', {
            data: { account }
        })
        return result === 1
    }

    /**
     * 检查用户名（手机号/邮箱）是否已注册
     */
    async checkRegistered(username: string): Promise<boolean> {
        const result = await iGet<boolean>('checkRegister', {
            data: { username }
        })
        return result ?? false
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

    // ========== 会员中心(登录后) ==========

    /**
     * 我的资料(当前登录会员信息)
     */
    async myInfo(): Promise<MemberInfo | undefined> {
        return iGet<MemberInfo>("myInfo")
    }

    /**
     * 修改我的资料(昵称/头像/姓名/性别/生日)
     * @param data headImg 支持 base64(data:image/..)自动上传为静态文件
     */
    async updateBaseInfo(data: Readonly<{ name?: string; nickname?: string; headImg?: string; sex?: number; birthday?: string }>): Promise<MemberInfo | undefined> {
        return iPost<MemberInfo>("updateBaseInfo", { data })
    }

    /**
     * 修改密码
     */
    async changePwd(oldPwd: string, newPwd: string): Promise<boolean> {
        return iPostSuccess("changePwd", { data: { oldPwd, newPwd } })
    }

    /**
     * 我的收货地址列表(默认地址在前)
     */
    async addressList(): Promise<Array<MemberAddress>> {
        return (await iGet<Array<MemberAddress>>("addressList")) ?? []
    }

    /**
     * 新增/更新收货地址(id为空新增,否则更新; defaultAddr=true自动设为默认)
     */
    async addressSave(data: Readonly<Partial<MemberAddress>>): Promise<MemberAddress | undefined> {
        return iPost<MemberAddress>("addressSave", { data })
    }

    /**
     * 删除收货地址
     */
    async addressDelete(id: number): Promise<boolean> {
        return iPostSuccess("addressDelete", { data: { id } })
    }

    /**
     * 设为默认收货地址
     */
    async addressSetDefault(id: number): Promise<boolean> {
        return iPostSuccess("addressSetDefault", { data: { id } })
    }

    /**
     * 我的商城订单(分页,按订单状态分类过滤)
     * @param params state: all=全部 unpaid=待付款 paid=已付款 finished=已完成(已收货) refunded=已退款
     */
    async orderList(params: Readonly<{ state?: OrderState } & PageParams>): Promise<PageInfo<OrderVO> | undefined> {
        return iGet<PageInfo<OrderVO>>("orderList", { data: { ...params, pageNo: String(params.pageNo), pageSize: String(params.pageSize) } })
    }
}

export const icmsClient = new ICMSClient()
