import { creepTypeModule } from "@/interface/creep_type.module";
import { Color, CreepTypeNames } from "@/const";
import { actModule } from "@/interface/act.module";
import { worldStateModule } from "@/interface/world_state.module";
import { carrier0, carrier1 } from "./carrier";
import { filter } from "lodash";




// 1 : 3 : 2
const repairer = creepTypeModule.getCreepType(
    CreepTypeNames.REPAIRER,
    {
        work: 13, // 1400
        carry: 20, //900
        move: 17, // 800
    }
)

export const repairer0: Role = {
    roleName: "repairer0",
    roleInfo: "repairer0: withdraw(container top) -> [store(extension) > repair > build > upgrade] ",
    creepType: repairer,
    creepNum: 1,
    color: Color.WORKER,
    runRole(creep) {
        const store = global.structures.myStores.get("core");
        var busy = global.ifRoomLackEnergy;
        const threshold = creep.store.getCapacity() / 2;
        // if (global.ifRoomLackEnergy) {
        //     carrier0.runRole(creep);
        // }


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
                    if (creep.moveToTarget(new RoomPosition(45, 13, "W51S27"), 0)) {
                        const link: StructureLink = global.structures.myLinks.get("core");
                        const storage: AnyStoreStructure = global.structures.myStores.get("core");
                        creep.withdraw(link, RESOURCE_ENERGY);
                        creep.transfer(storage, RESOURCE_ENERGY);
                    }
                }
            }
        }
    
    }
}