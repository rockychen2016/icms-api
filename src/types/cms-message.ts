import { ChannelType, WebsiteOwner } from "./site";

/**
 * 评论内容
 */
export interface Reviews extends WebsiteOwner {
    /**
     * 被评论内容的类型
     */
    reviewType: ChannelType,
    /**
     * 被评论内容编号
     */
    entityNo: string,
    /**
     * 评论人
     */
    name: string,
    /**
     * 评论人ID,即loginUserId, 如果允许未登录评论则uid为空
     */
    uid?: string,
    /**
     * 评论人头像
     */
    avatar?: string,
    /**
     * 评级
     * 如最多5颗星
     * 0没给评级,1表示一颗星,2表示2颗星等等
     * 排序desc
     */
    rating: number,

    /**
     * 评论内容,可能为空
     */
    message?:string,

    /**
     * 评论时间
     */
    createTime:string,

    /**
     * 是否可见状态
     */
    visible:boolean,

    /**
     * 是否管理模似输入
     */
    custom?:boolean,
    /**
     * 模似输入时间
     */
    createdAt?:string
}

/**
 * 订阅用户
 */
export interface SubscribeUser extends WebsiteOwner {
    /** 用户昵称 */
    nickname?: string,
    /** 邮箱 */
    email: string,
    /** 是否已取消订阅 */
    cancelSubscribe: boolean,
    /** 订阅时间 */
    subscribeTime: string
}

/**
 * 联系我们留言
 */
export interface ContactUs extends WebsiteOwner {
    /** 留言用户姓名 */
    name: string,
    /** 电话 */
    phone?: string,
    /** 邮箱 */
    email?: string,
    /** 主题 */
    subject?: string,
    /** 留言内容 */
    message?: string,
    /** 转发邮箱 */
    forwardEmail?: string,
    /** 创建时间 */
    createTime: string
}
