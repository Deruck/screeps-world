import { creepTypeModule } from "@/interface/creep_type.module";
import { Color, CreepTypeNames } from "@/const";
import { actModule } from "@/interface/act.module";
import { worldStateModule } from "@/interface/world_state.module";

const starter = creepTypeModule.getCreepType(
    CreepTypeNames.STARTER,
    {
        work: 1, // 100
        move: 2, // 100
        carry: 1 // 50
    }
)

export const starter0: Role = {
    roleName: "starter: harvest(source0) -> [store(spawn | extension) > repair > build > upgrade] ",
    roleInfo: "starter: harvest(source0) -> [store(spawn | extension) > repair > build > upgrade] ",
    creepNum: 0,
    creepType: starter,
    runRole(creep) {
        const source = worldStateModule.getAllSourcesInRoom(creep.room)[0];
        var busy = false;
        if (creep.store[RESOURCE_ENERGY] == 0) {
            actModule.harvestResource(creep, source.id);
            busy = true;
        }
        if (!busy) {
            const closestStore = worldStateModule.getClosestAvailableStore(creep, RESOURCE_ENERGY, [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]);
            if (closestStore) {
                actModule.storeResource(creep, closestStore.id, RESOURCE_ENERGY);
                busy = true;
            }
        }
        if (!busy) {
            const threshold = 0.8;
            const repairStructure = worldStateModule.getClosestRepairStructure(creep, threshold, [STRUCTURE_WALL]);
            if (repairStructure) {
                actModule.repairStructure(creep, repairStructure.id, 2);
                busy = true;
            }
        }
        if (!busy) {
            const filter = (constructionSite: ConstructionSite) => constructionSite.structureType != STRUCTURE_ROAD;
            const constructionSite = worldStateModule.getMyClosestConstructionSite(creep, filter);
            if (constructionSite) {
                actModule.buildConstruction(creep, constructionSite.id, 5);
                busy = true;
            }
        }
        if (!busy) {
            actModule.upgrade(creep, 10);
        }
    }
}

export const starter1: Role = {
    roleName: "starter: harvest(source1) -> [store(spawn | extension) > repair > build > upgrade] ",
    roleInfo: "starter: harvest(source1) -> [store(spawn | extension) > repair > build > upgrade] ",
    creepNum: 0,
    creepType: starter,
    runRole(creep) {
        const source = worldStateModule.getAllSourcesInRoom(creep.room)[1];
        var busy = false;
        if (creep.store[RESOURCE_ENERGY] == 0) {
            actModule.harvestResource(creep, source.id);
            busy = true;
        }
        if (!busy) {
            const closestStore = worldStateModule.getClosestAvailableStore(creep, RESOURCE_ENERGY, [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]);
            if (closestStore) {
                actModule.storeResource(creep, closestStore.id, RESOURCE_ENERGY);
                busy = true;
            }
        }
        if (!busy) {
            const threshold = 0.8;
            const repairStructure = worldStateModule.getClosestRepairStructure(creep, threshold, [STRUCTURE_WALL]);
            if (repairStructure) {
                actModule.repairStructure(creep, repairStructure.id, 2);
                busy = true;
            }
        }
        if (!busy) {
            const filter = (constructionSite: ConstructionSite) => constructionSite.structureType != STRUCTURE_ROAD;
            const constructionSite = worldStateModule.getMyClosestConstructionSite(creep, filter);
            if (constructionSite) {
                actModule.buildConstruction(creep, constructionSite.id, 5);
                busy = true;
            }
        }
        if (!busy) {
            actModule.upgrade(creep, 10);
        }
    }
}