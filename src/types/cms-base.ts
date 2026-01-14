import { ImageVO, MemberSrv, SeoProps } from "./site"

/**
 * 附件类型
 */
export type AttachmentType = 'image' | 'video' | 'audio' | 'file';
/**
 * 附件
 */
export interface AttachmentVO{
    id:string,
    name:string,
    size:number,
    url:string,
    type:AttachmentType
}

/**
 * 内容基类,隶属网站
 */
interface OwnerWebSite{
    id:string,
    /**
     * 语言站点编号
     */
    websiteNo:string,
    /**
     * 具体内容编号
     */
    entityNo:string,
    /**
     * 隶属栏目层级,如(channelNoLevel)
     */
    channelNoLevel:string,

    /**
     * 创建时间
     */
    createTime:string,

    /**
     * 排序
     */
    sortBy:number,

    /**
     * Seo相关属性
     */
    seoProps?:SeoProps
    
}

/**
 * 基础内容类
 */
export interface AbsContent extends OwnerWebSite{
    /**
     * 内容标题
     */
    title:string,
    /**
     * 内容简介
     */
    shortDesc?:string,
    /**
     * 关键字
     */
    keywords?:string,

    /**
     * 内容图片列表
     */
    imageList?:Array<ImageVO>,
    /**
     * 附件列表
     */
    attachments?:Array<AttachmentVO>,
    /**
     * 缩略图
     */
    thumbUrl?:string
}

export type OwnerUser = {
    id:string,
    name:string,
    nickname?:string,
    avatar?:string,
    userType:number
}

export type MemberSrvProp ={
    memberSrvSet:Set<MemberSrv>
}

/**
 * 知识付费基类
 */
export interface AbsCopyrightContent extends AbsContent{
    /**
     * 作者
     */
    author?:string,
    /**
     * 来源
     */
    source?:string,
    /**
     * 官方发布
     */
    official:boolean,
    /**
     * 发布人
     */
    ownerInfo?:OwnerUser,
    /**
     * 查阅权限,即当前登录用户有对应的会员卡方可以查看(集合中fee==0或该字段为空、所属最近层级的栏目memberSrvProp为空或fee==0的除外)
     */
    memberSrvProp?:MemberSrvProp
}

/**
 * 内容分组    
 */
export interface ContentGroup<T>{
    id:string,
    websiteId:string,
    groupNo:string,
    groupName:string,
    groupDesc?:string,
    image?:ImageVO,
    sortBy:number,
    groupSets:Array<T>
}

export interface GroupSet<T extends AbsContent>{
    contentObject:T
}

export interface PageInfo<T>{
    total:number,
    pageSize:number,
    pageCount:number,
    pageNo:number,
    first:boolean,
    last:boolean,
    content:Array<T>
}

/**
 * 分页参数
 */
export type PageParams = {
    /**
     * 排序
     */
    sort?:'ASC' | 'DESC',
    /**
     * 排序字段
     */
    sortBy?:string,
    pageNo:number,
    pageSize:number
}

