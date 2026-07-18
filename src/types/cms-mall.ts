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
