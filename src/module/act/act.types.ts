import { ActTypes, ReturnCode } from "@/const";



declare global {
    interface CreepMemory {
        act?: {
            /**
                * 0: 闲置
                * 1: 通过check
                * 2: 通过prepare
                * 3: 通过exec
                * 4: 通过end
                */
            status: 0 | 1 | 2 | 3 | 4,
            busy: boolean,
            lastActTime?: number,
            actOpts?: ActOpts,
            actType?: ActTypes,
            token?: string

            times?: number
        }
    }
        
    interface Act extends ActOpts {
        /**
         * 动作名称
         */
        actType: ActTypes,
        token: string,
        threshold?: number,

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
         * 动作结束，回收资源、发布事件等
         */
        end: (creep: Creep) => boolean,
        /**
         * 意外终止条件，为false提前跳出
         */
        break_condition?: (creep: Creep) => boolean,
    }

    interface ActOpts {
        resourceObjId?: Id<AnyResourceObj>,
        storeId?: Id<AnyStoreStructure>,
        constructionSiteId?: Id<ConstructionSite>,
        structureId?: Id<Structure>,
        creepId?: Id<Creep>,

        resourceType?: ResourceConstant,
        times?: number,
        amount?: number,

        moveToOpts?: MoveToOpts
    }

    interface ActCreator {
        (actOpts: ActOpts): Act
    }

    interface ActWorkReturn {
        actType: ActTypes | undefined,
        returnCode: ReturnCode
    }
}