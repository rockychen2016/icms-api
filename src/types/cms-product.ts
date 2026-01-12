import { AbsContent } from "./cms-base";

export interface ProductContent extends AbsContent{
    /**
     * 规格说明
     */
    specification?:string,
    
    /**
     * 产品品特性
     */
    features?:string,

    /**
     * 产品价格
     */
    salePrice:number,

    /**
     * 市场价格
     */
    marketPrice?:number,

    details?:{
        /**
         * 产品简介
         */
        introduction?:string,
        /**
         * 产品详情
         */
        description?:string,
    }
}

