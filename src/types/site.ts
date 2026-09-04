import { User } from "@rock.chen/icms-http-client"

/**
 * (国际化)语言站点,用于语言站点切换
 */
export interface I18NWebsite {
    /**
     * 后端语言枚举,如zh_CN,en等
     */
    id: string,
    /**
     * 后端语言枚举对应的code,与前端locale值是对应的
     * 如(zh-CN,en),与ID不同是中横线与下横线，因为后端为java,枚举不能使用中横线定义,为了与前端对应所以增加了该code字段
     */
    code: string,
    /**
     * 后端语言枚举对应的name(如"简体中文"、"English"等)
     */
    name: string,
    /**
     * 后端语言枚举对应的icon(如国旗)
     */
    icon: string,
    /**
     * 站点id(即Websit实体主键)
     */
    websiteId: string,
    /**
     * 站点编号(即Websit实体编号,全局唯一)
     */
    websiteNo: string,
}

/**
 * SEO属性
 */
export type SeoProps = {
    //网站title标签内容
    title?: string,
    //网站<mate name="keywords" content="" />
    keywords?: string,
    //网站<mate name="description" content="" />
    description?: string
}

/**
 * 站点实体(与Website是一对多关系)
 */
export interface Site {
    id: string,
    //网站简介
    description?: string,
    //网站网址
    url?: string,
    //网址二维码(手机扫码访问)
    qrcodeUrl?: string,
    //微信公众号二维码(对接微信公众平台后通过接口生成)
    wxQrcodeUrl?: string,
    //ICP备案号
    icpNumber?: string,
    //IP白名单,多个IP使用逗号隔开(即调用API的白名单)
    safeDomains?: string,
    //调用Api使用到的key,每个站点一个，唯一的
    apiKey: string,
    //所包含的言语网站
    webSiteList?: Array<WebSite>
}

/**
 * 网站实体
 */
export interface WebSite {
    id: string,
    name: string,
    /**
     * 网站别名
     */
    aliasName?: string,
    /**
     * 言语,对应 I18NWebsite.id
     */
    language: string,
    /**
     * 网站简介
     */
    description?: string,
    /**
     * 网站编号
     */
    websiteNo: string,

    //显示网站上的联系信息(如联系我们，及网站页脚部分)
    contactPhone?: string,
    contactEmail?: string,
    contactAddr?: string,
    contactQrCode?: string,

    /**
     * 允许插入js代码，encode后保存,前端需要decode后才能使用
     */
    scriptContent?: string,

    /**
     * ICMS接口到期时间,即ICMS系统API调到到期时间
     */
    dueTime?: string,

    /**
     * 网站创建时间
     */
    createTime?: string

    /**
     * 是否默认网站,输入网站优先打开默认网站，如果没有默认即打开Site下属网站的第一个网站
     */
    defaultSite?: boolean,

    /**
     * Cookie 政策内容公示的内容,即用户打开网站时，公示Cookie使用政策(用户点击“接受”或“不接受”)
     */
    agreement?: string,
    /**
     * 网站SEO相关设置
     */
    seoProps?: SeoProps,
    /**
     * 网站不可用状态,true为不可用,false表示可用
     */
    unavailable: boolean,

    /**
     * 网站备案号(引用的是site.icpNumber)
     */
    icpNumber?: string,

    /**
     * 网址二维码(引用的是site.qrcodeUrl)
     */
    qrcodeUrl?: string,

    /**
     * 微信二维码
     */
    wxQrcodeUrl?: string,

    /**
     * 网站导航菜单
     */
    websiteNavVOList?: Array<WebsiteNavVO>,

    /**
     * 友情链接(sortBy 升序前20个链接)
     */
    friendLinksList?: Array<FriendLink>
}

export interface Webchannel {
    id: string,
    /**
     * 栏目类型
     */
    channelType: ChannelType,
    /**
     * 栏目编号，全局唯一 
     */
    channelNo: string,
    /**
     * 栏目名称/标题
     */
    name: string,
    /**
     * 栏目URI
     */
    uri: string,
    /**
     * 栏目图片
     */
    image?: ImageVO,
    /**
     * 跳转链接
     */
    jumpUrl?: string,
    /**
     * 跳转链接的名称
     */
    jumpText?: string,

    /**
     * 栏目子标题
     */
    subTitle?: string,

    /**
     * 自定义标记
     */
    tagLabel?: string,
    /**
     * 栏目简介
     */
    introduction?: string,

    /**
     * 栏目下的Banner图片，可以用作轮播动画
     */
    banners?: Array<ImageVO>,

    /**
     * 栏目级别,由channelNo组成
     * 格式如channelNo,channelNo,channelNo,
     * 解释如当前栏目level值为channelNo1,channelNo2,channelNo3,
     * 那么当前栏目的父级栏目为channelNo3,channelNo3的父级栏目为channelNo2,依次类推,根栏目level为空
     * 注意：系统最多允许设置三级栏目
     */
    level?: string,

    /**
     * 栏目排序,接口返回是按升序排序的
     */
    sortBy: number,

    /**
     * 返回值与channelNo一致
     */
    key: string,
    /**
     * 返回复与name一致
     */
    title: string,

    /**
     * 隶属语言站点ID(全局唯一)
     */
    websiteId: string,
    /**
     * 隶属语言站点编号(全局唯一)
     */
    websiteNo: string,

    /**
     * 样
     */
    seoProps?: SeoProps,

    children?: Array<WebsiteNavVO>

}

/**
 * 友情链接
 */
export interface FriendLink {
    /**
     * id
     */
    id: string,
    /**
     * 链接名称
     */
    name: string,
    /**
     * 排序
     */
    sortBy: number,
    /**
     * 链接说明
     */
    description?: string,
    /**
     * 链接网址
     */
    url: string,
    /**
     * 是否可见
     */
    visible: boolean
}

/**
 * 链接分组
 */
export interface LinkGroup {
    id: string,
    /** 分组名称 */
    name: string,
    /** 分组下的链接列表 */
    friendLinkList?: Array<FriendLink>
}

export type WebsiteNavVO = Pick<Webchannel, 'id' | 'name' | 'channelNo' | 'channelType' | 'uri' | 'image' | 'jumpUrl' | 'jumpText' | 'subTitle' | 'level' | 'sortBy' | 'children'>

/**
 * 栏目类型
 */
export type ChannelType = 'page' | 'product' | 'article' | 'photo' | 'video' | 'activity'

/**
 * 会员卡收费方式
 */
export type MemberFeeType = 'monthly' | 'quarterly' | 'year' | 'forever';

export type ImageVO = {
    id: string,
    name?: string,
    thumbUrl: string,
    imageUrl: string
}

export type Metadata = {
    title?: string,
    description?: string,
    keywords?: string,
    authors?: {
        url: string,
        name: string
    },
    [k: string]: unknown,
}

export type WebsiteInfo = {
    "website": WebSite,
    "i18nSites": Array<I18NWebsite>,
    "metadata"?: Metadata
}

/**
 * 会员用户相关资源的所有者
 */
export interface Owner {
    id: string,
    teamId: string,
    siteId: string,
}

/**
 * 隶属网站相关
 */
export interface WebsiteOwner extends Owner {
    websiteId: string
}

/**
 * 会员增值服务
 */
export interface MemberSrv extends WebsiteOwner {
    id: string,
    /**
     * 会员购买时记录该字段code,后台订单会自动翻译对应的会员卡
     */
    code: string,
    name: string,
    feeType: MemberFeeType,
    fee?: number
}

export interface Member extends User {
    [key: string]: any
}

/**
 * 会员级别
 */
export type UserLevel = 'guest' | 'member';

/**
 * C端会员资料(对应后端 MemberInfoVO)
 */
export interface MemberInfo {
    id: string,
    name: string,
    nickname?: string,
    /** 头像地址(对应后端 headImg) */
    avatar?: string,
    email?: string,
    phone?: string,
    username: string,
    birthday?: string,
    /** 性别 0未知 1男 2女 */
    gender: number,
    level: UserLevel
}

/**
 * C端会员收货地址(对应后端 MemberAddress)
 */
export interface MemberAddress {
    id: number,
    poiId?: string,
    /** 收货人/地址名称 */
    name: string,
    aliasName?: string,
    countryCode?: string,
    provCode?: string,
    cityCode?: string,
    areaCode?: string,
    country?: string,
    province?: string,
    city?: string,
    area?: string,
    address?: string,
    postCode?: string,
    /** 联系电话(手机号,支持大陆/香港/国际格式) */
    mobile?: string,
    latitude?: number,
    longitude?: number,
    zoom?: number,
    /** 是否默认地址 */
    defaultAddr?: boolean
}

/**
 * 支付状态
 */
export type PayStatus = 'wait' | 'success' | 'fail' | 'cancel';

/**
 * 订单物流状态(由商户后台标记,暂不对接物流接口)
 */
export type LogisticsState = 'confirming' | 'shipping' | 'delivering' | 'received';

/**
 * C端订单分类查询状态
 * all=全部 unpaid=待付款 paid=已付款 finished=已完成(已收货) refunded=已退款
 */
export type OrderState = 'all' | 'unpaid' | 'paid' | 'finished' | 'refunded';

/**
 * 提交订单的商品项
 */
export interface SubmitOrderItem {
    /** 上架商品ID */
    goodsListedId: string;
    /** 购买数量 */
    quantity: number;
}

/**
 * 订单支付状态(支付完成后前端轮询)
 */
export interface OrderPayStatusVO {
    orderNo: string,
    /** 支付状态 */
    payStatus?: PayStatus,
    /** 支付方式 */
    payType?: PayType | null,
    /** 订单金额(元) */
    amount?: number,
    /** 付款成功时间 */
    payTime?: string,
}

/**
 * 支付方式
 */
export type PayType = 'WECHAT' | 'ALIPAY' | 'UNLINE';

/**
 * C端会员订单(对应后端 MallOrder/BaseOrder 常用字段)
 */
export interface OrderVO {
    id: string,
    /** 订单编号 */
    orderNo: string,
    /** 下单用户名 */
    userName?: string,
    /** 订单内容简述 */
    description?: string,
    /** 订单金额(元) */
    amount?: number,
    /** 实际收到金额 */
    actualAmount?: number,
    /** 支付状态 */
    payStatus?: PayStatus,
    /** 支付方式 */
    payType?: PayType | null,
    /** 物流状态(空=未开始履约;由商户后台标记) */
    logisticsState?: LogisticsState | null,
    /** 退款状态(空=未发生退款; All=全退 Partial=部分退款) */
    refundState?: 'All' | 'Partial' | null,
    /** 下单时间 */
    createTime?: string,
    /** 支付成功时间 */
    payTime?: string,
    /** 结算货币 */
    settlementCurrency?: string,
    [k: string]: any
}