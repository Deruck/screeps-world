
export const createWorldStateModule = function (ctx: WorldStateModuleContext): WorldStateModule {
    const getObjectById = function<T extends _HasId>(this: WorldStateModule, id: Id<T>): T | null {
        let obj = ctx.globalMemoryModule.getIdToObjectFromCache(id);
        if (!obj) {
            obj = Game.getObjectById(id);
            if (obj) {
                console.log(`Get Object: ${obj.id}`);
                ctx.globalMemoryModule.putIdToObjectToCache(obj);
            }
        }
        return obj;
    }

    const getAllMyCreepsWithFilter = function(this: WorldStateModule, filter?: (creep: Creep) => boolean): Creep[] {
        let creepArr: Creep[] = [];
        filter = filter ? filter : () => true;
        for (let creepName in Game.creeps) {
            let creep = Game.creeps[creepName];
            if (filter(creep)) {
                creepArr.push(creep);
            }
        }
        return creepArr;
    }

    const getAllMyCreepsWithRole = function(this: WorldStateModule, roleName: string): Creep[] {
        let filter = (creep: Creep) => creep.memory.role.roleName == roleName;
        return this.getAllMyCreepsWithFilter(filter);
    }

    const getAllMySpawnsWithFilter = function (this: WorldStateModule, filter?: (spawn: StructureSpawn) => boolean): StructureSpawn[] {
        let spawnArr: StructureSpawn[] = [];
        filter = filter ? filter : () => true;
        for (let spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName];
            if (filter(spawn))
                spawnArr.push(spawn);
        }
        return spawnArr;
    };

    const getAllSourcesInRoom = function (this: WorldStateModule, room: Room): Source[] {
        return room.find(FIND_SOURCES);
    };

    const getMyClosestConstructionSite = function (this: WorldStateModule, creep: Creep): ConstructionSite {
        if (!creep.memory.worldState) {
            this._resetCreepWorldStateMemory(creep);
        }
        let closestConstructionSiteId = creep.memory.worldState.closestConstructionSiteId;
        if (closestConstructionSiteId) {
            var closestConstructionSite = this.getObjectById(closestConstructionSiteId);
            if (closestConstructionSite) {
                return closestConstructionSite;
            }
        }
        var closestConstructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
            filter: (structure: Structure) =>
            // @ts-ignore
            (structure.my === undefined || structure.my == true)
        });
        closestConstructionSiteId = closestConstructionSite.id;
        creep.actLog(`find closest construction [${closestConstructionSiteId}]`);
        creep.memory.worldState.closestConstructionSiteId = closestConstructionSiteId;
        return closestConstructionSite;
    };

    const getAllMyConstructionSiteWithFilter = function (this: WorldStateModule, room: Room, filter?: (constructionSite: ConstructionSite) => boolean): ConstructionSite[] {
        return room.find(FIND_MY_CONSTRUCTION_SITES, { filter: filter });
    };

    const getAllAvailableStore = function (this: WorldStateModule, room: Room, resourceType: ResourceConstant): AnyStoreStructure[]{
        var stores = ctx.globalMemoryModule.getRoomToAvailableStoreFromCache(room, resourceType);
        if (!stores) {
            stores = room.find(FIND_STRUCTURES, {
                // @ts-ignore
                filter: (structure: AnyStructure) => structure.store && structure.store.getFreeCapacity(resourceType) > 0
            });
            console.log(`Finding available store...`);
            ctx.globalMemoryModule.putRoomToAvailableStoreFromCache(room, resourceType, stores);
        }

        return stores;
    };

    const getClosestAvailableStore = function (this: WorldStateModule, creep: Creep, resourceType: ResourceConstant): AnyStoreStructure{
        if (!creep.memory.worldState) {
            this._resetCreepWorldStateMemory(creep);
        }
        let closestAvailableStoreId = creep.memory.worldState.closestAvailableStoreId;
        if (closestAvailableStoreId) {
            var closestAvailableStore = this.getObjectById(closestAvailableStoreId);
            if (closestAvailableStore && closestAvailableStore.store.getFreeCapacity(resourceType) > 0) {
                return closestAvailableStore;
            }
        }
        //@ts-ignore
        var closestAvailableStore: AnyStoreStructure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
             //@ts-ignore
            filter: (structure: AnyStructure) => structure.store && structure.store.getFreeCapacity(resourceType) > 0
        });
        closestAvailableStoreId = closestAvailableStore.id;
        creep.actLog(`find closest store [${closestAvailableStoreId}]`);
        creep.memory.worldState.closestAvailableStoreId = closestAvailableStoreId;
        return closestAvailableStore;
    };

    const getRepairStructures = function (this: WorldStateModule, room: Room, threshold: number): Structure[]{
        var structures = ctx.globalMemoryModule.getRepairStructureFromCache(room);
        if (!structures) {
            structures = room.find(FIND_STRUCTURES, {
                filter: (structure: Structure) =>
                    // @ts-ignore
                    (structure.my === undefined || structure.my == true) &&
                    structure.hits / structure.hitsMax < threshold &&
                    structure.structureType != STRUCTURE_WALL
            })
            ctx.globalMemoryModule.putRepairStructureToCache(room, structures);
        }
        return structures;
    };

    const getClosestRepairStructure = function (this: WorldStateModule, creep: Creep, threshold: number): Structure{
        if (!creep.memory.worldState) {
            this._resetCreepWorldStateMemory(creep);
        }
        let closestRepairStructureId = creep.memory.worldState.closestRepairStructureId;
        if (closestRepairStructureId) {
            var closestRepairStructure = this.getObjectById(closestRepairStructureId);
            if (closestRepairStructure && closestRepairStructure.hits / closestRepairStructure.hitsMax < threshold) {
                return closestRepairStructure;
            }
        }
        var closestRepairStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure: Structure) =>
                    // @ts-ignore
                    (structure.my === undefined || structure.my == true) &&
                    structure.hits / structure.hitsMax < threshold &&
                    structure.structureType != STRUCTURE_WALL
        });
        closestRepairStructureId = closestRepairStructure.id;
        creep.actLog(`find closest repair structure [${closestRepairStructureId}]`);
        creep.memory.worldState.closestRepairStructureId = closestRepairStructureId;
        return closestRepairStructure;
    };


    const _resetCreepWorldStateMemory = function (this: WorldStateModule, creep: Creep): void {
        creep.memory.worldState = {

        };
    };

    return {
        getClosestRepairStructure: getClosestRepairStructure,
        getRepairStructures: getRepairStructures,
        getClosestAvailableStore: getClosestAvailableStore,
        getAllAvailableStore: getAllAvailableStore,
        getObjectById: getObjectById,
        getAllMyCreepsWithFilter: getAllMyCreepsWithFilter, 
        getAllMyCreepsWithRole: getAllMyCreepsWithRole,
        getAllMySpawnsWithFilter: getAllMySpawnsWithFilter,
        getAllSourcesInRoom: getAllSourcesInRoom,
        getMyClosestConstructionSite: getMyClosestConstructionSite,
        getAllMyConstructionSiteWithFilter: getAllMyConstructionSiteWithFilter,
        _resetCreepWorldStateMemory: _resetCreepWorldStateMemory
    }
}