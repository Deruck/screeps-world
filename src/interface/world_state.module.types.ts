interface WorldStateModuleContext {
    globalMemoryModule: GlobalMemoryModule,
}

interface WorldStateModule {
    _resetCreepWorldStateMemory(this: WorldStateModule, creep: Creep): void;

    getObjectById<T extends _HasId>(this: WorldStateModule, id: Id<T>): T | null; 

    getAllMyCreepsWithFilter(this: WorldStateModule, filter?: (creep: Creep) => boolean): Creep[];

    getAllMyCreepsWithRole(this: WorldStateModule, roleName: string): Creep[];

    getAllMySpawnsWithFilter(this: WorldStateModule, filter?: (spawn: StructureSpawn) => boolean): StructureSpawn[];

    getAllMyConstructionSiteWithFilter(this: WorldStateModule, room: Room, filter?: (spawn: StructureSpawn) => boolean): ConstructionSite[];

    getAllSourcesInRoom(this: WorldStateModule, room: Room): Source[];

    getMyClosestConstructionSite(this: WorldStateModule, creep: Creep): ConstructionSite;

    getClosestAvailableStore(this: WorldStateModule, creep: Creep, resourceType: ResourceConstant): AnyStoreStructure;

    getAllAvailableStore(this: WorldStateModule, room: Room, resourceType: ResourceConstant): AnyStoreStructure[];

    getRepairStructures(this: WorldStateModule, room: Room, threshold: number): Structure[];

    getClosestRepairStructure(this: WorldStateModule, creep: Creep, threshold: number): Structure;
}