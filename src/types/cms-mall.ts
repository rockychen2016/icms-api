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
    /** 视频名称 */
    name?: string
    /** 视频描述 */
    description?: string
    /** 封面图地址 */
    coverUrl?: string
    /** 视频地址 */
    url?: string
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
    /** 网站编号 */
    websiteNo?: string
    /** 关联基础产品编码 */
    proCode?: string
    createTime?: string
    lastUpdateTime?: string
    /** 货架编码 */
    cateCode?: string
    /** 货架名称（后端 Transient 填充） */
    cateName?: string
}

/** 商品详情（含 detailContent，由 getGoodsDetail 接口返回） */
export interface GoodsDetail extends GoodsItem {
    /** 详情内容（HTML，后端 showDetail() 将 detailContent 填充到 rawContent） */
    rawContent?: string
    /** 商品规格（后端 showSpecInfo() 填充） */
    specInfo?: SpecInfo
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

/** 商品规格属性 */
export interface SpecProps {
    /** 属性编号 */
    code: string
    /** 属性名称 */
    name: string
    /** 售价 */
    price: number
    /** 标识图标 */
    iconUrl?: string
    /** 绑定的图片文件JSON */
    images?: string
}

/** 商品规格项 */
export interface SpecItem {
    /** 规格编号 */
    code: string
    /** 规格名称 */
    name: string
    /** 是否必选 */
    required: boolean
    /** 是否可多选 */
    multiple: boolean
    /** 规格说明代码 */
    descCode?: string
    /** 启用图库绑定 */
    imageLib: boolean
    /** 属性列表 */
    props?: Array<SpecProps>
}

/** 商品规格 */
export interface SpecInfo {
    /** 产品编码 */
    productCode?: string
    /** 规格项列表 */
    specificationItems?: Array<SpecItem>
}
