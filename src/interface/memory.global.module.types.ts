interface GlobalMemoryModuleContext {

}

interface GlobalMemoryModule {
    getGlobalMemory(this: GlobalMemoryModule): GlobalMemory;

    getIdToObjectFromCache<T extends _HasId>(this: GlobalMemoryModule, id: Id<T>): T | null;

    putIdToObjectToCache<T extends _HasId>(this: GlobalMemoryModule, object: T): void;

    getRoomToAvailableStoreFromCache(this: GlobalMemoryModule, room: Room, resourceType: ResourceConstant): AnyStoreStructure[];

    putRoomToAvailableStoreFromCache(this: GlobalMemoryModule, room: Room, resourceType: ResourceConstant, stores: AnyStoreStructure[]): void;

    getRepairStructureFromCache(this: GlobalMemoryModule, room: Room): Structure[];

    putRepairStructureToCache(this: GlobalMemoryModule, room: Room, structures: Structure[]): void;

    resetCache(this: GlobalMemoryModule): void;

    _initGlobalMemoryIfNotExist(this: GlobalMemoryModule): void;
}