import { ActTypes, ReturnCode } from "@/const";

declare global {
    interface ActModuleContext {
        worldStateModule: WorldStateModule
    }
    
    interface ActModule {
        /**
         * 确保将被打断的act执行完，形成资源的闭环
         */
        work(this: ActModule, creep: Creep): ActWorkReturn;

        harvestResource(this: ActModule, creep: Creep, sourceId: Id<AnyResourceObj>, moveToOpts?: MoveToOpts): ReturnCode;

        storeResource(this: ActModule, creep: Creep, storeId: Id<AnyStoreStructure>, resourceType: ResourceConstant, amount?: number, moveToOpts?: MoveToOpts): ReturnCode;

        upgrade(this: ActModule, creep: Creep, times?: number, moveToOpts?: MoveToOpts): ReturnCode;

        withdrawResource(this: ActModule, creep: Creep, storeId: Id<AnyStoreStructure>, resourceType: ResourceConstant, amount?: number, moveToOpts?: MoveToOpts): ReturnCode;

        buildConstruction(this: ActModule, creep: Creep, constructionSiteId: Id<ConstructionSite>, times?: number, moveToOpts?: MoveToOpts): ReturnCode;
        
        repairStructure(this: ActModule, creep: Creep, structureId: Id<Structure>, times?: number, moveToOpts?: MoveToOpts): ReturnCode;
        
        _getAct(actType: ActTypes, actOpts: ActOpts): Act;

        _actCreatorMenu: Map<ActTypes, ActCreator>;

        _resetActMemory(this: ActModule, creep: Creep): void;

        _completeAct(this: ActModule, creep: Creep, actType: ActTypes, actOpts: ActOpts): ReturnCode;

        _runAct(this: ActModule, creep: Creep): ReturnCode;
    }
}

