import { ReturnCode, TaskTypes } from "@/const";

declare global {
    interface TaskModuleContext {
        actModule: ActModule;
    }
    
    interface TaskModule {
        work(this: TaskModule, creep: Creep): TaskWorkReturn;
        
        harvestToStore(
            this: TaskModule,creep: Creep, fromSourceId: Id<Source>, toStoreId: Id<AnyStoreStructure>,
            resourceType: ResourceConstant, amount?: number, reusePath?: number
        ): ReturnCode;
    
        // harvestToUpgrade(
        //     creep: Creep, fromId: Id<Source>, times?: number,
        //     fromMoveToOpts?: MoveToOpts, toMoveToOpts?: MoveToOpts
        // ): ReturnCode;
    
        // harvestToBuild(
        //     creep: Creep, fromId: Id<Source>, toConstructionSiteId: Id<ConstructionSite>,
        //     times?: number, fromMoveToOpts?: MoveToOpts, toMoveToOpts?: MoveToOpts
        // ): ReturnCode;

        _resetTaskMemory(creep: Creep): void;

        _taskCreatorMenu: Map<TaskTypes, TaskCreator>;

        _getTask(this: TaskModule, taskType: TaskTypes, taskOpts: TaskOpts): Task;

        _completeTask(this: TaskModule, creep: Creep, taskType: TaskTypes, taskOpts: TaskOpts): ReturnCode;
    
        _runTask(this: TaskModule, creep: Creep): ReturnCode;
    }
}

