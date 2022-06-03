import { creepTypeModule } from "@/interface/creep_type.module";
import { Color, CreepTypeNames } from "@/const";
import { actModule } from "@/interface/act.module";
import { worldStateModule } from "@/interface/world_state.module";



const harvester = creepTypeModule.getCreepType(
    CreepTypeNames.HARVESTER,
    {
        work: 2, //5, // 500
        carry: 1,
        move: 1 //3 // 150
    }
)

export const harvester0: Role = {
    roleName: "harvester0",
    roleInfo: "harvest container right",
    creepType: harvester,
    creepNum: 1, 
    color: Color.HARVESTER,
    runRole(creep) {
        //@ts-ignore
        const source: Source =  worldStateModule.getObjectById("5bbcad2f9099fc012e636cad");
        if (creep.moveToTarget(new RoomPosition(37, 12, "E4S49"), 0)) {
            creep.harvest(source);
            //@ts-ignore
            const link: StructureLink = worldStateModule.getObjectById("6290c8eb817aa31bb34e764a");
            actModule.storeResource(creep, link.id, RESOURCE_ENERGY);
        }
    }
}

export const harvester1: Role = {
    roleName: "harvester1",
    roleInfo: "harvest container left",
    creepType: harvester,
    creepNum: 1, 
    color: Color.HARVESTER,
    runRole(creep) {
        //@ts-ignore
        const source: Source =  worldStateModule.getObjectById("5bbcad2f9099fc012e636cab");
        if (creep.moveToTarget(new RoomPosition(11, 7, "E4S49"), 0)) {
            creep.harvest(source);
            //@ts-ignore
            const link: StructureLink = worldStateModule.getObjectById("6290b85dfd0df37b31c4d29b");
            actModule.storeResource(creep, link.id, RESOURCE_ENERGY);
        }
    }
}