import { AbsContent } from './cms-base'

/**
 * 视频内容
 */
export interface VideoContent extends AbsContent {
    /** 视频链接 */
    videoUrl?: string
    details?: {
        /**
         * 视频简介
         */
        introduction?: string
        /**
         * 视频详情
         */
        description?: string
    }
}
