/**
 * (国际化)语言站点,用于语言站点切换
 */
export interface I18NWebsite{
    /**
     * 后端语言枚举,如zh_CN,en等
     */
    id:string,
    /**
     * 后端语言枚举对应的code,与前端locale值是对应的
     * 如(zh-CN,en),与ID不同是中横线与下横线，因为后端为java,枚举不能使用中横线定义,为了与前端对应所以增加了该code字段
     */
    code:string,
    /**
     * 后端语言枚举对应的name(如"简体中文"、"English"等)
     */
    name:string,
    /**
     * 后端语言枚举对应的icon(如国旗)
     */
    icon:string,
    /**
     * 站点id(即Websit实体主键)
     */
    websiteId:string,
    /**
     * 站点编号(即Websit实体编号,全局唯一)
     */
    websiteNo:string,
}

/**
 * SEO属性
 */
export type SeoProps={
    //网站title标签内容
    title?:string,
    //网站<mate name="keywords" content="" />
    keywords?:string,
    //网站<mate name="description" content="" />
    description?:string
}

/**
 * 站点实体(与Website是一对多关系)
 */
export interface Site{
    id:string,
    //网站简介
    description?:string,
    //网站网址
    url?:string,
    //网址二维码(手机扫码访问)
    qrcodeUrl?:string,
    //微信公众号二维码(对接微信公众平台后通过接口生成)
    wxQrcodeUrl?:string,
    //ICP备案号
    icpNumber?:string,
    //IP白名单,多个IP使用逗号隔开(即调用API的白名单)
    safeDomains?:string,
    //调用Api使用到的key,每个站点一个，唯一的
    apiKey:string,
    //所包含的言语网站
    webSiteList?:Array<WebSite>
}

/**
 * 网站实体
 */
export interface WebSite{
    id:string,
    name:string,
    /**
     * 网站别名
     */
    aliasName?:string,
    /**
     * 言语,对应 I18NWebsite.id
     */
    language:string,
    /**
     * 网站简介
     */
    description?:string,
    /**
     * 网站编号
     */
    websiteNo:string,

    //显示网站上的联系信息(如联系我们，及网站页脚部分)
    contactPhone?:string,
    contactEmail?:string,
    contactAddr?:string,
    contactQrCode?:string,

    /**
     * 允许插入js代码，encode后保存,前端需要decode后才能使用
     */
    scriptContent?:string,

    /**
     * ICMS接口到期时间,即ICMS系统API调到到期时间
     */
    dueTime?:string,

    /**
     * 网站创建时间
     */
    createTime?:string

    /**
     * 是否默认网站,输入网站优先打开默认网站，如果没有默认即打开Site下属网站的第一个网站
     */
    defaultSite?:boolean,

    /**
     * Cookie 政策内容公示的内容,即用户打开网站时，公示Cookie使用政策(用户点击“接受”或“不接受”)
     */
    agreement?:string,
    /**
     * 网站SEO相关设置
     */
    seoProps?:SeoProps,
    /**
     * 网站不可用状态,true为不可用,false表示可用
     */
    unavailable:boolean,

    /**
     * 网站备案号(引用的是site.icpNumber)
     */
    icpNumber?:string,

    /**
     * 网址二维码(引用的是site.qrcodeUrl)
     */
    qrcodeUrl?:string,
}
