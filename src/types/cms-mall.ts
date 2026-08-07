/**
 * 商城规格描述
 */
export interface SpecDescription {
    id: string,
    /** 规格编码 */
    code: string,
    /** 规格描述内容 */
    description?: string,
    /** 规格图片列表 */
    images?: Array<string>,
    /** JSON格式的额外属性 */
    props?: Record<string, string>
}

/** 商品图片 */
export interface GoodsImage {
    id: string
    /** 图片地址 */
    imageUrl: string
    /** 缩略图地址 */
    thumbUrl?: string
    /** 图片名称 */
    name?: string
}

/** 商品视频 */
export interface GoodsVideo {
    id?: string
    url?: string
    poster?: string
}

/** 商品基础信息（用于列表展示） */
export interface GoodsItem {
    id: string
    code: string
    name: string
    unitCode: string
    salePrice: number
    marketPrice: number
    description?: string
    images?: Array<GoodsImage>
    video?: GoodsVideo
    tags?: string
    hidden?: boolean
    createTime?: string
    lastUpdateTime?: string
    /** 货架编码 */
    cateCode?: string
    /** 货架名称（后端 Transient 填充） */
    cateName?: string
}

/** 货架（商品类目） */
export interface GoodsCategory {
    id: string
    /** 货架编码，格式 000-000-000-000-000 */
    code: string
    name: string
    description?: string
    sortValue?: string
    /** 是否为叶子节点 */
    leaf?: boolean
}

/** 商品标签 */
export interface GoodsTag {
    id: string
    code: string
    name: string
    websiteNo?: string
}
