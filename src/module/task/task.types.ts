import { TaskTypes, ReturnCode } from "@/const";



declare global {
    interface CreepMemory {
        task?: {
            /**
                * 0: 闲置
                * 1: 通过check
                * 2: 通过prepare
                * 3: 通过exec
                * 4: 通过end
                */
            status: 0 | 1 | 2 | 3 | 4,
            busy: boolean,
            lastTaskTime?: number,
            taskOpts?: TaskOpts,
            taskType?: TaskTypes,
            token?: string
        }
    }
        
    interface Task {
        /**
         * 动作名称
         */
        taskType: TaskTypes,
        token: string,

        resourceObjId?: Id<AnyResourceObj>,
        fromStoreId?: Id<AnyStoreStructure>,
        toStoreId?: Id<AnyStoreStructure>,
        constructionSiteId?: Id<ConstructionSite>,

        resourceType?: ResourceConstant,
        times?: number,
        amount?: number,

        reusePath?: number,
        moveToOptsArr?: MoveToOpts[],

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
        exec: (creep: Creep) => ReturnCode,
        /**
         * 动作结束，回收资源、发布事件等
         */
        end: (creep: Creep) => boolean,
        /**
         * 意外终止条件，提前跳出
         */
        break_condition?: (creep: Creep) => boolean,
    }

    interface TaskOpts {
        resourceObjId?: Id<AnyResourceObj>,
        fromStoreId?: Id<AnyStoreStructure>,
        toStoreId?: Id<AnyStoreStructure>,
        constructionSiteId?: Id<ConstructionSite>,

        resourceType?: ResourceConstant,
        times?: number,
        amount?: number,

        reusePath?: number,
        moveToOptsArr?: MoveToOpts[],
    }

    interface TaskCreator {
        (taskOpts: TaskOpts): Task
    }

    
    interface TaskWorkReturn {
        taskType: TaskTypes | undefined,
        returnCode: ReturnCode
    }
}