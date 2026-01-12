import { AbsCopyrightContent } from "./cms-base";

export interface NewsContent extends AbsCopyrightContent{
    jumpUrl?:string,
    details?:{
        /**
         * 简介
         */
        introduction?:string,
        /**
         * 详情
         */
        description?:string
    }
}

