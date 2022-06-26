import { creepTypeModule } from "@/interface/creep_type.module";
import { Color, CreepTypeNames } from "@/const";
import { actModule } from "@/interface/act.module";
import { worldStateModule } from "@/interface/world_state.module";

const starter = creepTypeModule.getCreepType(
    CreepTypeNames.STARTER,
    {
        work: 2, // 200
        move: 4, // 200
        carry: 2 // 100
    }
)

export const starterSourceTop: Role = {
    roleName: "starterTop",
    roleInfo: "starter: harvest(source top) -> [store(spawn | extension) > repair > build > upgrade] ",
    color: Color.TRANSFERER,
    creepNum: 0,
    creepType: starter,
    runRole(creep) {
        const source = global.structures.sources.get("top");
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

        /*****************************************************************************************
         * flag build
         *****************************************************************************************/
        if (!busy) {
            const flags = creep.room.find(FIND_FLAGS, {filter: {color: COLOR_GREY}});
            if (flags.length > 0) {
                busy = true;
                const structures = flags[0].pos.lookFor(LOOK_CONSTRUCTION_SITES);
                if (structures.length > 0) {
                    const structure = structures[0];
                    actModule.buildConstruction(creep, structure.id);
                } else {
                    flags[0].remove();
                }
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

export const starterSourceBottom: Role = {
    roleName: "starterBottom",
    roleInfo: "starter: harvest(sourceBottom) -> [store(spawn | extension) > repair > build > upgrade] ",
    color: Color.TRANSFERER,
    creepNum: 0,
    creepType: starter,
    runRole(creep) {
        const source = global.structures.sources.get("bottom");
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
        /*****************************************************************************************
         * flag build
         *****************************************************************************************/
         if (!busy) {
            const flags = creep.room.find(FIND_FLAGS, {filter: {color: COLOR_GREY}});
            if (flags.length > 0) {
                busy = true;
                const structures = flags[0].pos.lookFor(LOOK_CONSTRUCTION_SITES);
                if (structures.length > 0) {
                    const structure = structures[0];
                    actModule.buildConstruction(creep, structure.id);
                } else {
                    flags[0].remove();
                }
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


export const upgraderBottom: Role = {
    roleName: "upgraderStarter",
    roleInfo: "worker: keep upgrading from source0",
    creepNum: 0,
    creepType: starter,
    color: Color.TRANSFERER,
    runRole(creep) {
        //@ts-ignore
        const source = global.structures.sources.get("top");

        if (creep.store[RESOURCE_ENERGY] == 0) {
            actModule.harvestResource(creep, source.id);
        } else {
            actModule.upgrade(creep);
        }
    }
}