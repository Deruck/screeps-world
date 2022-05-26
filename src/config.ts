import { creepTypeModule } from "./interface/creep_type.module";
import { Color, CreepTypeNames } from "./const";
import { actModule } from "./interface/act.module";
import { worldStateModule } from "./interface/world_state.module";

const starter = creepTypeModule.getCreepType(
    CreepTypeNames.STARTER,
    {
        work: 1,
        move: 1,
        carry: 1
    }
)



const starter0: Role = {
    roleName: "starter: harvest(source0) -> [store(spawn | extension) > repair > build > upgrade] ",
    creepNum: 8,
    creepType: starter,
    runRole(creep) {
        const source = worldStateModule.getAllSourcesInRoom(creep.room)[0];
        var busy = false;
        if (creep.store[RESOURCE_ENERGY] == 0) {
            actModule.harvestResource(creep, source.id);
            busy = true;
        }
        if (!busy) {
            const availableStores = worldStateModule.getAllAvailableStore(creep.room, RESOURCE_ENERGY);
            if (availableStores.length > 0) {
                const clothestStore = worldStateModule.getClosestAvailableStore(creep, RESOURCE_ENERGY);
                actModule.storeResource(creep, clothestStore.id, RESOURCE_ENERGY);
                busy = true;
            }
        }
        if (!busy) {
            const threshold = 0.99;
            const repairStructures = worldStateModule.getRepairStructures(creep.room, threshold);
            if (repairStructures.length > 0) {
                const structure = worldStateModule.getClosestRepairStructure(creep, threshold);
                actModule.repairStructure(creep, structure.id, 2);
                busy = true;
            }
        }
        if (!busy && worldStateModule.getAllMyConstructionSiteWithFilter(creep.room).length > 0) {
            const cstSt = worldStateModule.getMyClosestConstructionSite(creep);
            actModule.buildConstruction(creep, cstSt.id, 5);
            busy = true;
        }
        if (!busy) {
            actModule.upgrade(creep, 10);
        }
    }
}

const starter1: Role = {
    roleName: "starter: harvest(source1) -> [store(spawn | extension) > repair > build > upgrade] ",
    creepNum: 8,
    creepType: starter,
    runRole(creep) {
        const source = worldStateModule.getAllSourcesInRoom(creep.room)[1];
        var busy = false;
        if (creep.store[RESOURCE_ENERGY] == 0) {
            actModule.harvestResource(creep, source.id);
            busy = true;
        }
        if (!busy) {
            const availableStores = worldStateModule.getAllAvailableStore(creep.room, RESOURCE_ENERGY);
            if (availableStores.length > 0) {
                const clothestStore = worldStateModule.getClosestAvailableStore(creep, RESOURCE_ENERGY);
                actModule.storeResource(creep, clothestStore.id, RESOURCE_ENERGY);
                busy = true;
            }
        }
        if (!busy) {
            const threshold = 0.99;
            const repairStructures = worldStateModule.getRepairStructures(creep.room, threshold);
            if (repairStructures.length > 0) {
                const structure = worldStateModule.getClosestRepairStructure(creep, threshold);
                actModule.repairStructure(creep, structure.id, 2);
                busy = true;
            }
        }
        if (!busy && worldStateModule.getAllMyConstructionSiteWithFilter(creep.room).length > 0) {
            const cstSt = worldStateModule.getMyClosestConstructionSite(creep);
            actModule.buildConstruction(creep, cstSt.id, 5);
            busy = true;
        }
        if (!busy) {
            actModule.upgrade(creep, 10);
        }
    }
}

const upgrader: Role = {
    roleName: "starter: keep upgrading from source0",
    creepNum: 1,
    creepType: starter,
    runRole(creep) {
        const source = worldStateModule.getAllSourcesInRoom(creep.room)[0];
        if (creep.store[RESOURCE_ENERGY] == 0) {
            actModule.harvestResource(creep, source.id);
        } else {
            actModule.upgrade(creep);
        }
    }
}


export const configs = {
    roleList: [starter0, starter1, upgrader]
}