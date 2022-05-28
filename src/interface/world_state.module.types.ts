interface WorldStateModuleContext {
    globalMemoryModule: GlobalMemoryModule,
}

interface WorldStateModule {
    /*****************************************************************************************
     * 
     *****************************************************************************************/
    _resetCreepWorldStateMemory(this: WorldStateModule, creep: Creep): void;

    getObjectById<T extends _HasId>(this: WorldStateModule, id: Id<T>): T | null; 

    /*****************************************************************************************
     * 
     *****************************************************************************************/

    getAllMyCreeps(this: WorldStateModule, filter?: (creep: Creep) => boolean): Creep[];

    getAllMyCreepsWithRole(this: WorldStateModule, roleName: string): Creep[];

    /*****************************************************************************************
     * 
     *****************************************************************************************/

    getAllMySpawns(this: WorldStateModule, filter?: (spawn: StructureSpawn) => boolean): StructureSpawn[];

    /*****************************************************************************************
     * 
     *****************************************************************************************/

    getAllMyConstructionSites(this: WorldStateModule, room: Room, filter?: (constructionSite: ConstructionSite) => boolean): ConstructionSite[];

    getMyClosestConstructionSite(this: WorldStateModule, creep: Creep, filter?: (constructionSite: ConstructionSite) => boolean): ConstructionSite;

    /*****************************************************************************************
     * 
     *****************************************************************************************/
    
    getAllSourcesInRoom(this: WorldStateModule, room: Room): Source[];

    /*****************************************************************************************
     * 
     *****************************************************************************************/

    getClosestAvailableStore(this: WorldStateModule, creep: Creep, resourceType: ResourceConstant, includeTypes: StructureConstant[]): AnyStoreStructure;

    getAllAvailableStores(this: WorldStateModule, room: Room, resourceType: ResourceConstant, includeTypes: StructureConstant[]): AnyStoreStructure[];

    /*****************************************************************************************
     * 
     *****************************************************************************************/

    getRepairStructures(this: WorldStateModule, room: Room, threshold: number, excludeTypes: StructureConstant[]): Structure[];

    getClosestRepairStructure(this: WorldStateModule, creep: Creep, threshold: number, excludeTypes: StructureConstant[]): Structure;
}