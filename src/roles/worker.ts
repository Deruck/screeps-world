import { creepTypeModule } from "@/interface/creep_type.module";
import { Color, CreepTypeNames } from "@/const";
import { actModule } from "@/interface/act.module";
import { worldStateModule } from "@/interface/world_state.module";
import { carrierLeft } from "./carrier";




// 1 : 3 : 2
const worker = creepTypeModule.getCreepType(
    CreepTypeNames.WORKER,
    {
        work: 5, // 500
        carry: 15, //750
        move: 10 // 500
    }
)

const upgrader = creepTypeModule.getCreepType(
    CreepTypeNames.WORKER, {
        work: 1, 
        carry: 1, 
        move: 1
    }
)


export const worker0: Role = {
    roleName: "worker0",
    roleInfo: "worker: withdraw(container right) -> [store(extension) > repair > build > upgrade] ",
    creepType: worker,
    creepNum: 0, 
    color: Color.WORKER,
    runRole(creep) {
        //@ts-ignore
        const container: StructureContainer = worldStateModule.getObjectById("628ffc46ee9148e646a73c46");
        var busy = global.ifRoomLackEnergy;
        // withdraw
        if (!busy && creep.store[RESOURCE_ENERGY] == 0) {
            actModule.withdrawResource(creep, container.id, RESOURCE_ENERGY);
            busy = true;
        }
        // build
        if (!busy) {
            // const filter = (constructionSite: ConstructionSite) => constructionSite.structureType != STRUCTURE_ROAD;
            const constructionSite = worldStateModule.getMyClosestConstructionSite(creep);
            if (constructionSite) {
                actModule.buildConstruction(creep, constructionSite.id, 5);
                busy = true;
            }
        }
        // upgrade
        if (!busy) {
            actModule.upgrade(creep, 10);
        }
    }
}



export const worker1: Role = {
    roleName: "worker1",
    roleInfo: "worker: withdraw(container left) -> [store(spawn) > repair > build > upgrade] ",
    creepType: worker,
    creepNum: 3, 
    color: Color.WORKER,
    runRole(creep) {
        var busy = global.ifRoomLackEnergy;
        const threshold = creep.store.getCapacity() / 2;
        if (global.ifRoomLackEnergy) {
            carrierLeft.runRole(creep);
        }


        if (!busy && creep.store[RESOURCE_ENERGY] <= threshold) {
            actModule.withdrawResource(creep, global.structures.coreStore.id, RESOURCE_ENERGY);
            busy = true;
        }

        /*****************************************************************************************
         * flag build
         *****************************************************************************************/
        if (!busy) {
            const flags = creep.room.find(FIND_FLAGS);
            if (flags.length > 0) {
                const structures = flags[0].pos.lookFor(LOOK_CONSTRUCTION_SITES);
                if (structures.length > 0) {
                    const structure = structures[0];
                    actModule.buildConstruction(creep, structure.id);
                } else {
                    flags[0].remove();
                }
            }
        }
        
        // build
        if (!busy) {
            // const filter = (constructionSite: ConstructionSite) => constructionSite.structureType != STRUCTURE_ROAD;
            const constructionSite = worldStateModule.getMyClosestConstructionSite(creep);
            if (constructionSite) {
                actModule.buildConstruction(creep, constructionSite.id);
                busy = true;
            }
        }
        // upgrade
        if (!busy) {
            actModule.upgrade(creep, 20);
        }
    }
}


export const upgrader0: Role = {
    roleName: "upgrader",
    roleInfo: "worker: keep upgrading from source0",
    creepNum: 1,
    creepType: upgrader,
    color: Color.UPGRADER,
    runRole(creep) {
        //@ts-ignore
        const link: StructureLink = worldStateModule.getObjectById("6290c8eb817aa31bb34e764a");

        if (creep.store[RESOURCE_ENERGY] == 0) {
            actModule.withdrawResource(creep, link.id, RESOURCE_ENERGY);
        } else {
            actModule.upgrade(creep);
        }
    }
}