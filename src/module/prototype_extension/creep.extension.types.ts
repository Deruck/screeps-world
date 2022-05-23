import { ReturnCode, ActTypes } from "@/const";


declare global {
    interface CreepExtension {

        moveToTarget(
            this: Creep,
            targetPos: RoomPosition,
            range: number,
            moveToOpts?: MoveToOpts
        ): ReturnCode;

        runAct(this: Creep, actType: ActTypes, actOpts: ActOpts);

        _resetActMemory(this: Creep);

        harvestEnergy(this: Creep, source: Source): ReturnCode;

        storeEnergy(this: Creep, store: AnyStoreStructure): ReturnCode;

        upgrade(this: Creep): ReturnCode;

        // runTask(this: Creep, task: taskTypes, taskOpts: TaskOpts): ReturnCode;

        resetTaskMemory(this: Creep);
    }
    
    interface Creep {
        moveToTarget(
            this: Creep,
            targetPos: RoomPosition,
            range: number,
            moveToOpts?: MoveToOpts
        ): ReturnCode;

        harvestEnergy(this: Creep, source: Source): ReturnCode;

        storeEnergy(this: Creep, store: AnyStoreStructure): ReturnCode;

        upgrade(this: Creep): ReturnCode;

        // runTask(this: Creep, task: taskTypes, taskOpts: TaskOpts): ReturnCode;

        resetTaskMemory(this: Creep);
    }
    
    interface CreepMemory {
        role: string,
        busy: boolean,
    }
    
}
