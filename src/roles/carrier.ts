import { creepTypeModule } from "@/interface/creep_type.module";
import { Color, CreepTypeNames } from "@/const";
import { actModule } from "@/interface/act.module";
import { worldStateModule } from "@/interface/world_state.module";


const carrier = creepTypeModule.getCreepType(
    CreepTypeNames.CARRIER,
    {
        carry: 24, //1200
        move: 12 // 600
    }
)

export const carrierLeft: Role = {
    roleName: "carrier1",
    roleInfo: "carry from container left",
    creepType: carrier,
    creepNum: 1, 
    color: Color.CARRIER,
    runRole(creep) {
        var busy = false;
        const threshold = 0;

        if (!busy && creep.store[RESOURCE_ENERGY] <= threshold) {
            const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(target) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                busy = true;
            } 
        }
        if (!busy && creep.store[RESOURCE_ENERGY] <= threshold) {
            var droppedStructure = creep.room.find(FIND_TOMBSTONES, {
                filter: (tomb: Tombstone) => tomb.store[RESOURCE_ENERGY] > 0
            });
            if (droppedStructure.length == 0) {
                // @ts-ignore
                droppedStructure = creep.room.find(FIND_RUINS, {
                    filter: (ruin: Ruin) => ruin.store[RESOURCE_ENERGY] > 0
                });
            }
            if (droppedStructure.length > 0) {
                // @ts-ignore
                actModule.withdrawResource(creep, droppedStructure[0].id, RESOURCE_ENERGY);
            } else {
                actModule.withdrawResource(creep, global.structures.coreStore.id, RESOURCE_ENERGY);
            }
            //@ts-ignore
            busy = true;
        }
        // store: extension && spawn
        if (!busy) {
            const closestStore = worldStateModule.getClosestAvailableStore(creep, RESOURCE_ENERGY, [STRUCTURE_EXTENSION, STRUCTURE_SPAWN]);
            if (closestStore) {
                actModule.storeResource(creep, closestStore.id, RESOURCE_ENERGY);
                busy = true;
            }
        }
        // store: tower
        if (!busy) {
            var storeTower = undefined;
            for (var tower of global.structures.myTowers) {
                if (tower.store[RESOURCE_ENERGY] / tower.store.getCapacity(RESOURCE_ENERGY) < 0.8) {
                    storeTower = tower;
                }
            }
            if (storeTower) {
                actModule.storeResource(creep, storeTower.id, RESOURCE_ENERGY);
                busy = true;
            }
        }
    }
}

export const carrierRight: Role = {
    roleName: "carrier2",
    roleInfo: "carry from container right",
    creepType: carrier,
    creepNum: 0, 
    color: Color.CARRIER,
    runRole(creep) {
        var busy = false;
        if (!busy && creep.store[RESOURCE_ENERGY] == 0) {
            const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(target) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                busy = true;
            } 
        }

        if (!busy && creep.store[RESOURCE_ENERGY] == 0) {
            var droppedStructure = creep.room.find(FIND_TOMBSTONES, {
                filter: (tomb: Tombstone) => tomb.store[RESOURCE_ENERGY] > 0
            });
            if (droppedStructure.length == 0) {
                // @ts-ignore
                droppedStructure = creep.room.find(FIND_RUINS, {
                    filter: (ruin: Ruin) => ruin.store[RESOURCE_ENERGY] > 0
                });
            }
            if (droppedStructure.length > 0) {
                // @ts-ignore
                actModule.withdrawResource(creep, droppedStructure[0].id, RESOURCE_ENERGY);
            } else {
                //@ts-ignore
                const container: StructureContainer = worldStateModule.getObjectById("628ffc46ee9148e646a73c46");
                actModule.withdrawResource(creep, container.id, RESOURCE_ENERGY);
            }
            busy = true;
        }
        // store: extension && spawn
        if (!busy) {
            const closestStore = worldStateModule.getClosestAvailableStore(creep, RESOURCE_ENERGY, [STRUCTURE_EXTENSION, STRUCTURE_SPAWN]);
            if (closestStore) {
                actModule.storeResource(creep, closestStore.id, RESOURCE_ENERGY);
                busy = true;
            }
        }
        // store: tower
        if (!busy) {
            const closestStore = worldStateModule.getClosestAvailableStore(creep, RESOURCE_ENERGY, [STRUCTURE_TOWER]);
            if (closestStore) {
                actModule.storeResource(creep, closestStore.id, RESOURCE_ENERGY);
                busy = true;
            }
        }
    }
}
    