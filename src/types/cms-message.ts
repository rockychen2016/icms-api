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

