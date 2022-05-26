export const createGlobalMemoryModule = function (ctx: GlobalMemoryModuleContext): GlobalMemoryModule {
    const _initGlobalMemoryIfNotExist = function (this: GlobalMemoryModule): void {
        if (!global.memory) {
            var globalMemory: GlobalMemory = {
                cache: {
                    idToOject: new Map(),
                    roomToAvailableStore: {
                        time: Game.time,
                        cache: new Map()
                    }, 
                    repairStructure: {
                        time: Game.time,
                        cache: new Map()
                    }
                }
                
            };
            global.memory = globalMemory;
        }
    }

    const getIdToObjectFromCache = function <T extends _HasId>(this: GlobalMemoryModule, id: Id<T>): T | null{
        this._initGlobalMemoryIfNotExist();
        var obj = global.memory.cache.idToOject.get(id);
        obj = obj ? obj : null;
        // @ts-ignore
        return obj;
    }

    const putIdToObjectToCache = function <T extends _HasId>(this: GlobalMemoryModule, object: T): void {
        this._initGlobalMemoryIfNotExist();
        global.memory.cache.idToOject.set(object.id, object);
    }

    const getGlobalMemory = function (this: GlobalMemoryModule): GlobalMemory {
        this._initGlobalMemoryIfNotExist();
        return global.memory;
    }

    const resetCache = function (this: GlobalMemoryModule): void {
        this._initGlobalMemoryIfNotExist();
        global.memory.cache = {
            idToOject: new Map(),
            roomToAvailableStore: {
                time: Game.time,
                cache: new Map()
            },
            repairStructure: {
                time: Game.time,
                cache: new Map()
            }
        }
    }

    const getRoomToAvailableStoreFromCache = function (this: GlobalMemoryModule, room: Room, resourceType: ResourceConstant): AnyStoreStructure[]{
        this._initGlobalMemoryIfNotExist();
        if (global.memory.cache.roomToAvailableStore.time != Game.time) {
            global.memory.cache.roomToAvailableStore = {
                time: Game.time, 
                cache: new Map()
            }
            return undefined;
        } else {
            const roomToResourceType = global.memory.cache.roomToAvailableStore.cache.get(room.name);
            if (!roomToResourceType)
                return undefined;
            else
                return roomToResourceType.get(resourceType);
        }
    };

    const putRoomToAvailableStoreFromCache = function (this: GlobalMemoryModule, room: Room, resourceType: ResourceConstant, stores: AnyStoreStructure[]): void{
        this._initGlobalMemoryIfNotExist();
        if (global.memory.cache.roomToAvailableStore.time != Game.time) {
            global.memory.cache.roomToAvailableStore = {
                time: Game.time,
                cache: new Map()
            }
        }
        if (!global.memory.cache.roomToAvailableStore.cache.get(room.name)) {
            global.memory.cache.roomToAvailableStore.cache.set(room.name, new Map());
        }
        global.memory.cache.roomToAvailableStore.cache.get(room.name).set(resourceType, stores);
    };

    const getRepairStructureFromCache = function (this: GlobalMemoryModule, room: Room): Structure[] {
        this._initGlobalMemoryIfNotExist();
        if (global.memory.cache.repairStructure.time != Game.time) {
            global.memory.cache.repairStructure = {
                time: Game.time, 
                cache: new Map()
            }
            return undefined;
        } else {
            return global.memory.cache.repairStructure.cache.get(room.name);
        }
    };

    const putRepairStructureToCache = function (this: GlobalMemoryModule, room: Room, structures: Structure[]): void{
        this._initGlobalMemoryIfNotExist();
        if (global.memory.cache.repairStructure.time != Game.time) {
            global.memory.cache.repairStructure = {
                time: Game.time,
                cache: new Map()
            }
        }
        global.memory.cache.repairStructure.cache.set(room.name, structures);
    };





    return {
        getRepairStructureFromCache: getRepairStructureFromCache,
        putRepairStructureToCache: putRepairStructureToCache,
        getRoomToAvailableStoreFromCache: getRoomToAvailableStoreFromCache,
        putRoomToAvailableStoreFromCache: putRoomToAvailableStoreFromCache,
        getGlobalMemory: getGlobalMemory,
        getIdToObjectFromCache: getIdToObjectFromCache,
        putIdToObjectToCache: putIdToObjectToCache,
        resetCache: resetCache,
        _initGlobalMemoryIfNotExist: _initGlobalMemoryIfNotExist
    }
}