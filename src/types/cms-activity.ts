import { AbsContent } from './cms-base'

/**
 * 活动内容
 */
export interface ActivityContent extends AbsContent {
    /** 活动开始时间 */
    startTime?: string
    /** 活动结束时间 */
    endTime?: string
    /** 活动地点 */
    location?: string
    details?: {
        /**
         * 活动简介
         */
        introduction?: string
        /**
         * 活动详情
         */
        description?: string
    }
}
