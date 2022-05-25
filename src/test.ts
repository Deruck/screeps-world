import { CreepTypeNames } from "./const";
import { actModule } from "./interface/act.module";
import { creepTypeModule } from "./interface/creep_type.module";
import { extensionModule } from "./interface/extension.module";
import { taskModule } from "./interface/task.module";

// import { taskTypes } from "./module/task/task";

extensionModule.addPrototypeExtension();

const starter = creepTypeModule.getCreepType(
    CreepTypeNames.STARTER,
    {
        work: 1,
        move: 2,
        carry: 2
    }
)


export const loop = function () {
    console.log("=============================================================");
    const spawn1 = Game.spawns["Spawn1"];
    console.log(starter.bodyParts);
    console.log(starter.cost);
    console.log([WORK, MOVE, MOVE, CARRY, CARRY]);

    console.log("spawning: " + spawn1.spawnCreepFromType(starter, 20));

    // const creep1 = Game.creeps["creep1"];
    // // @ts-ignore
    // const storage: StructureStorage = creep1.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } })[0];
    // var source = creep1.room.find(FIND_SOURCES)[0];
    // const constructionSite: ConstructionSite = creep1.room.find(FIND_MY_CONSTRUCTION_SITES)[0];

    // console.log(`Harvest to Store: ${taskModule.harvestToStore(creep1, source.id, storage.id, RESOURCE_ENERGY)}`);

    // console.log("task work: " + JSON.stringify(taskModule.work(creep1)));
    // console.log("act work: " + JSON.stringify(actModule.work(creep1)));
    console.log("=============================================================");
}

