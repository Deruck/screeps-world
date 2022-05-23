import { CreepTypeNames } from "@/const"
import { taskTypes } from "./task";


declare global {
    interface CreepMemory {
        /**
         * 任务记录，
         */
        task: {
            /**
             * 0: 闲置
             * 1: 通过check
             * 2: 通过prepare
             * 3: 通过exec
             * 4: 通过end
             */
            status: 0 | 1 | 2 | 3 | 4,
            /**
             * 0: 初始
             * 1: 去往source的路上
             * 2: harvest中
             * 3: 回程
             * 4: store中
             */
            harvestToStore?: 0 | 1 | 2 | 3 | 4,
        }
    }
        
    interface Task {
        /**
         * Task触发条件， 目前搁置
         * 初步设想是一个返回boolean的函数, 返回为true时代表触发任务
         * @param{context} 监听环境，可能来自event系统
         */
        // condition(context): boolean
        /**
         * 任务名称
         */
        task_name: taskTypes,
    
        /**
         * 可进行任务的对象集合，可能是creep的类型，或建筑
         */
        task_subject: Set<CreepTypeNames | STRUCTURE_SPAWN>,
        /**
         * 检查条件，一个tick内完成，检查通过返回true
         */
        check: (creep: Creep) => boolean,
        /**
         * 准备阶段，创建资源等，准备完成返回true
         */
        prepare: (creep: Creep) => boolean,
        /**
         * 执行阶段，执行完成返回true
         */
        exec: (creep: Creep) => boolean,
        /**
         * 任务结束，回收资源、发布事件等
         */
        end: (creep: Creep) => boolean,
        /**
         * 意外终止条件，提前跳出
         */
        break_condition?: (creep: Creep) => boolean,
    }

    interface TaskOpts {
        sourceId?: Id<Source>,
        storeId?: Id<AnyStoreStructure>,
        fromSourceId?: Id<Source>,

        toStoreId?: Id<AnyStoreStructure>,

        moveToOpts?: MoveToOpts
    }
}

