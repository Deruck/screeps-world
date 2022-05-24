import { ActTypes } from "@/const";



declare global {
    interface CreepMemory {
    }
        
    interface Act {
        /**
         * 动作名称
         */
        act_name: ActTypes,
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
         * 意外终止条件，提前跳出
         */
        break_condition?: (creep: Creep) => boolean,
    }

    interface ActOpts {
        source?: Source,
        store?: AnyStoreStructure,
        resourceType?: ResourceConstant,
        upgradeTimes?: number,
        amount?: number,

        moveToOpts?: MoveToOpts
    }

    interface ActCreator {
        (actOpts: ActOpts): Act
    }
}