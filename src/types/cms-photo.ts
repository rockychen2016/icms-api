import { AbsContent } from './cms-base'

/**
 * 相册内容
 */
export interface PhotoContent extends AbsContent {
    details?: {
        /**
         * 相册简介
         */
        introduction?: string
        /**
         * 相册详情
         */
        description?: string
    }
}
