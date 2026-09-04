import { FrameworkAdapter, HTTPRouter, RouteStorage, USER_TYPE_MAP } from "@rock.chen/icms-http-client";
import { helloURL } from "./server";

// 定义客户端接口映射：方法名 → iCMS API 路径
const APIMAP: Record<string, string> = {
    // 认证/注册
    register: "guest/register",
    checkRegister: "guest/checkRegister",
    sendcode: "guest/sendVCode",
    // 网站
    loadI18nList: "guest/site/i18nList",
    loadWebsite: "guest/site/currentWebSite",
    loadChannels: "guest/site/getChannelListByNo",
    loadChannelById: "guest/site/getChannelById",
    loadChannelByNo: "guest/site/getChannelByNo",
    loadChannelByUri: "guest/site/getChannelByUrl",
    // 产品
    loadProductDetail: "guest/site/getProduct",
    loadProductPageInfo: "guest/site/searchProductForPage",
    loadProductPageInfoByGroup: "guest/site/searchProductForPageByGroup",
    loadProductListByGroupId: "guest/site/searchProductByGroup",
    // 图文
    loadNewsDetail: "guest/site/getNewsDetail",
    loadNewsPageInfo: "guest/site/searchNewsForPage",
    loadNewsPageInfoByGroupId: "guest/site/searchNewsForPageByGroup",
    loadNewsListByGroupId: "guest/site/searchNewsByGroup",
    // 相册
    loadPhotoDetail: "guest/site/getPhoto",
    loadPhotoPageInfo: "guest/site/searchPhotoForPage",
    loadPhotoPageInfoByGroup: "guest/site/searchPhotoForPageByGroup",
    loadPhotoListByGroupId: "guest/site/searchPhotoByGroup",
    // 视频
    loadVideoDetail: "guest/site/getVideo",
    loadVideoPageInfo: "guest/site/searchVideoForPage",
    loadVideoPageInfoByGroup: "guest/site/searchVideoForPageByGroup",
    loadVideoListByGroupId: "guest/site/searchVideoByGroup",
    // 活动
    loadActivityDetail: "guest/site/getActivity",
    loadActivityPageInfo: "guest/site/searchActivityForPage",
    loadActivityPageInfoByGroup: "guest/site/searchActivityForPageByGroup",
    loadActivityListByGroupId: "guest/site/searchActivityByGroup",
    // 评论/订阅/联系
    loadReviewList: "guest/site/getReviewList",
    submitComment: "guest/site/comment",
    subscribe: "guest/site/userSubscribe",
    submitContactUs: "guest/site/contactUs",
    // 友链
    loadLinkGroups: "guest/site/getLinkGroupList",
    loadFriendLinks: "guest/site/getFriendLinks",
    submitLink: "guest/site/addLink",
    // 商城
    getSpecDescription: "guest/site/shop/getSpecDescription",
    // 会员中心(登录后)
    myInfo: "api/account/myInfo",
    updateBaseInfo: "api/account/updateBaseInfo",
    changePwd: "api/account/changePwd",
    addressList: "api/account/addressList",
    addressSave: "api/account/addressSave",
    addressDelete: "api/account/addressDelete",
    addressSetDefault: "api/account/addressSetDefault",
    orderList: "api/account/orderList",
    submitOrder: "api/account/submitOrder",
    orderPayStatus: "api/account/orderPayStatus",
    // 支付
    aliPcWeb: "api/pay/aliPcWeb",
}

export const icmsRouter = async <T, R>({
    request,
    routeAdapter,
    storage
}: Readonly<{
    request: T,
    routeAdapter: FrameworkAdapter<T, R>,
    storage: RouteStorage
}>): Promise<R> => {
    const router = new HTTPRouter({
        "config": {
            "userType": USER_TYPE_MAP.TYPE_C,
            "APIMAP": APIMAP,
            "helloURL": helloURL
        },
        "adapter": routeAdapter,
        "storage": storage
    });
    return await router.handleRequest(request);
}
