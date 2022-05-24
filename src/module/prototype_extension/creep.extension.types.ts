import { ReturnCode, ActTypes } from "@/const";


declare global {
    interface CreepExtension {

        moveToTarget(
            this: Creep,
            targetPos: RoomPosition,
            range: number,
            moveToOpts?: MoveToOpts
        ): ReturnCode;

        runAct(this: Creep, actType: ActTypes, actOpts: ActOpts): ReturnCode;

        _resetActMemory(this: Creep): void;

        harvestEnergy(this: Creep, source: Source, moveToOpts?: MoveToOpts): ReturnCode;

        storeResource(this: Creep, store: AnyStoreStructure, resourceType: ResourceConstant, amount?: number, moveToOpts?: MoveToOpts): ReturnCode;

        upgrade(this: Creep, upgradeTimes?: number, moveToOpts?: MoveToOpts): ReturnCode;

        // runTask(this: Creep, task: taskTypes, taskOpts: TaskOpts): ReturnCode;

        // resetTaskMemory(this: Creep);
    }

    interface Creep extends CreepExtension { }
    
    
    interface CreepMemory {
        role: string,
        /**
        * 动作记录，
        */
        act: {
            /**
                * 0: 闲置
                * 1: 通过check
                * 2: 通过prepare
                * 3: 通过exec
                * 4: 通过end
                */
            status: 0 | 1 | 2 | 3 | 4,
            busy: {
                status: boolean,
            },
            upgradeTimes?: number
        }
    }
    
}
