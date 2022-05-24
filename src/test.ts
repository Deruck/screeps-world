import { CreepTypeNames } from "./const";
import { CreepTypeModule } from "./interface/creep_type.module";
import { ExtensionModule } from "./interface/extension.module";
import { taskTypes } from "./module/task/task";

ExtensionModule.addPrototypeExtension();

const starter = CreepTypeModule.getCreepType(
    CreepTypeNames.STARTER, 
    {
        WORK: 1,
        CARRY: 1,
        MOVE: 1
    }
)



export const loop = function () {
    console.log("=============================================================");
    var creep1 = Game.creeps["creep1"];
    var source = creep1.room.find(FIND_SOURCES)[0];
    // @ts-ignore
    const container: StructureContainer = creep1.room.find(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_CONTAINER}
    })[0];
    if (creep1.store[RESOURCE_ENERGY] <= 0) {
        console.log("harvest: " + creep1.harvestEnergy(source));
    }
    console.log(creep1.storeResource(container, RESOURCE_ENERGY, 100, undefined));
    if (creep1.store[RESOURCE_ENERGY]) {
        console.log(creep1.upgrade(3));
    }
    console.log("=============================================================");
}

