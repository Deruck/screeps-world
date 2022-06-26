import { creepTypeModule } from "@/interface/creep_type.module";
import { Color, CreepTypeNames } from "@/const";
import { actModule } from "@/interface/act.module";
import { worldStateModule } from "@/interface/world_state.module";



const harvester = creepTypeModule.getCreepType(
    CreepTypeNames.HARVESTER,
    {
        work: 5, //5, // 500
        carry: 1,
        move: 3 //3 // 150
    }
)

export const harvester0: Role = {
    roleName: "harvesterUp",
    roleInfo: "harvest source top",
    creepType: harvester,
    creepNum: 1, 
    color: Color.HARVESTER,
    runRole(creep) {
        //@ts-ignore
        const source: Source = global.structures.sources.get("top");
        const harvestPos = new RoomPosition(25, 9, "W51S27")
        if (creep.moveToTarget(harvestPos, 0)) {
            creep.harvest(source);
            //@ts-ignore
            const link: StructureLink = global.structures.myLinks.get("top");
            actModule.storeResource(creep, link.id, RESOURCE_ENERGY);
        }
    }
}

export const harvester1: Role = {
    roleName: "harvesterBottom",
    roleInfo: "harvest source bottom",
    creepType: harvester,
    creepNum: 1, 
    color: Color.HARVESTER,
    runRole(creep) {
        //@ts-ignore
        const source: Source = global.structures.sources.get("bottom");
        const harvestPos = new RoomPosition(22, 37, "W51S27")
        if (creep.moveToTarget(harvestPos, 0)) {
            creep.harvest(source);
            //@ts-ignore
            const link: StructureLink = global.structures.myLinks.get("bottom");
            actModule.storeResource(creep, link.id, RESOURCE_ENERGY);
        }
    }
}