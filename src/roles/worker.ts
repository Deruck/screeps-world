import { creepTypeModule } from "@/interface/creep_type.module";
import { Color, CreepTypeNames } from "@/const";
import { actModule } from "@/interface/act.module";
import { worldStateModule } from "@/interface/world_state.module";
import { carrier0, carrier1 } from "./carrier";
import { filter } from "lodash";




// 1 : 3 : 2
const worker = creepTypeModule.getCreepType(
    CreepTypeNames.WORKER,
    {
        work: 13, // 1400
        carry: 20, //900
        move: 17, // 800
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
    roleInfo: "worker: withdraw(container top) -> [store(extension) > repair > build > upgrade] ",
    creepType: worker,
    creepNum: 1, 
    color: Color.WORKER,
    runRole(creep) {
        const store = global.structures.myStores.get("core");
        var busy = global.ifRoomLackEnergy;
        const threshold = creep.store.getCapacity() / 2;
        if (global.ifRoomLackEnergy) {
            carrier0.runRole(creep);
        }


        if (!busy && creep.store[RESOURCE_ENERGY] <= threshold) {
            actModule.withdrawResource(creep, store.id, RESOURCE_ENERGY);
            busy = true;
        }

        /*****************************************************************************************
         * flag build
         *****************************************************************************************/
        if (!busy) {
            busy = true;
            const repairIds = [
                "62a1ca07ccb1846ef94e39bd",
                "62a1ca1586de715878e987d1",
                // "629a4e488b8320f5acb5b890",
                // "62a1c9fe2ba9c66833ef29bb",
                "62a1ca0d4d1dab41edd64c6a",
            ]
            for (var id of repairIds) {
                // @ts-ignore
                var repairStructure: AnyStructure = Game.getObjectById(id); 
                if (repairStructure.hits < 1e8) {
                    if(creep.repair(repairStructure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairStructure);
                    }
                }
            }
        }
        if (!busy) {
            const flags = creep.room.find(FIND_FLAGS, {filter: {color: COLOR_GREY}});
            if (flags.length > 0) {
                const structures = flags[0].pos.lookFor(LOOK_CONSTRUCTION_SITES);
                if (structures.length > 0) {
                    busy = true;
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

export const worker1: Role = {
    roleName: "worker1",
    roleInfo: "worker: withdraw(container bottom) -> [store(extension) > repair > build > upgrade] ",
    creepType: worker,
    creepNum: 0, 
    color: Color.WORKER,
    runRole(creep) {
        const store = global.structures.myStores.get("core");
        var busy = global.ifRoomLackEnergy;
        const threshold = creep.store.getCapacity() / 2;
        if (global.ifRoomLackEnergy) {
            carrier1.runRole(creep);
        }


        if (!busy && creep.store[RESOURCE_ENERGY] <= threshold) {
            actModule.withdrawResource(creep, store.id, RESOURCE_ENERGY);
            busy = true;
        }

        /*****************************************************************************************
         * flag build
         *****************************************************************************************/
         if (!busy) {
            const flags = creep.room.find(FIND_FLAGS, {filter: {color: COLOR_GREY}});
            if (flags.length > 0) {
                const structures = flags[0].pos.lookFor(LOOK_CONSTRUCTION_SITES);
                if (structures.length > 0) {
                    busy = true;
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
    roleName: "upgrader0",
    roleInfo: "worker: keep upgrading from top",
    creepNum: 1,
    creepType: upgrader,
    color: Color.UPGRADER,
    runRole(creep) {
        const store = global.structures.myStores.get("core");
        // if(creep.signController(creep.room.controller, "Do not touch me, just wanna farm. 😉") == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(creep.room.controller);
        // }

        if (creep.store[RESOURCE_ENERGY] == 0) {
            actModule.withdrawResource(creep, store.id, RESOURCE_ENERGY);
        } else {
            actModule.upgrade(creep);
        }
    }
}