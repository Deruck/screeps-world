import { creepTypeModule } from "@/interface/creep_type.module";
import { Color, CreepTypeNames } from "@/const";
import { actModule } from "@/interface/act.module";
import { worldStateModule } from "@/interface/world_state.module";



const transferer = creepTypeModule.getCreepType(
    CreepTypeNames.TRANSFERER,
    {
        carry: 1, 
        move: 1
    }
)

export const transferer0: Role = {
    roleName: "transferer0",
    roleInfo: "transfer from link to storage",
    creepType: transferer,
    creepNum: 1, 
    color: Color.TRANSFERER,
    runRole(creep) {
        if (creep.moveToTarget(new RoomPosition(27, 13, "E4S49"), 0)) {
            //@ts-ignore
            const link: StructureLink = global.structures.linkMiddle;
            //@ts-ignore
            const storage: StructureStorage = global.structures.coreStore;
            creep.withdraw(link, RESOURCE_ENERGY);
            creep.transfer(storage, RESOURCE_ENERGY);
        }

    }
}