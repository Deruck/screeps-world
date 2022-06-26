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
        if (creep.moveToTarget(new RoomPosition(24, 21, "W51S27"), 0)) {
            const link: StructureLink = global.structures.myLinks.get("core");
            const storage: AnyStoreStructure = global.structures.myStores.get("core");
            creep.withdraw(link, RESOURCE_ENERGY);
            creep.transfer(storage, RESOURCE_ENERGY);
        }

    }
}

export const transfererBottom: Role = {
    roleName: "transfererBottom",
    roleInfo: "transfer from container bottom to storage",
    creepType: transferer,
    creepNum: 0, 
    color: Color.TRANSFERER,
    runRole(creep) {
        //@ts-ignore
        const container: StructureContainer = global.structures.myStores.get("bottom");
        //@ts-ignore
        const storage: StructureContainer = global.structures.myStores.get("core");
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            actModule.withdrawResource(creep, container.id, RESOURCE_ENERGY);
        } else {
            actModule.storeResource(creep, storage.id, RESOURCE_ENERGY);
        }

    }
}

export const transfererTop: Role = {
    roleName: "transfererTop",
    roleInfo: "transfer from container top to storage",
    creepType: transferer,
    creepNum: 0, 
    color: Color.TRANSFERER,
    runRole(creep) {
        //@ts-ignore
        const container: StructureContainer = global.structures.myLinks.get("top");
        //@ts-ignore
        const storage: StructureContainer = global.structures.myStores.get("core");
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            actModule.withdrawResource(creep, container.id, RESOURCE_ENERGY);
        } else {
            actModule.storeResource(creep, storage.id, RESOURCE_ENERGY);
        }

    }
}