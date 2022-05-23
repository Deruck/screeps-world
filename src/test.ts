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
    var creep1 = Game.creeps["creep1"];
    var source = creep1.room.find(FIND_SOURCES)[0];
    // @ts-ignore
    const container: StructureContainer = creep1.room.find(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_CONTAINER}
    })[0];
    // var code = creep1.runTask(
    //     taskTypes.TaskHarvestToStore,
    //     {
    //         fromSourceId: source.id,
    //         toStoreId: container.id,
    //         moveToOpts: {
    //             reusePath: 10,
    //             visualizePathStyle: { stroke: '#ffffff' },
    //         }
    //     }
    // )
    var code = creep1.runTask(
        taskTypes.TaskHarvestToUpgrade,
        {
            fromSourceId: source.id,
            moveToOpts: {
                reusePath: 10,
                visualizePathStyle: { stroke: '#ffffff' },
            }
        }
    )
    console.log(code);

}

