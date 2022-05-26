import { spawn } from "child_process";
import { configs } from "./config";
import { CreepTypeNames } from "./const";
import { actModule } from "./interface/act.module";
import { creepTypeModule } from "./interface/creep_type.module";
import { extensionModule } from "./interface/extension.module";
import { globalMemoryModule } from "./interface/memory.global.module";
import { taskModule } from "./interface/task.module";
import { worldStateModule } from "./interface/world_state.module";
import { MemoryController } from "./module/memory/memoryController";
import { actTest } from "./tests/act_test";

// import { taskTypes } from "./module/task/task";

extensionModule.addPrototypeExtension();
MemoryController.removeDeadCreepMemory();

const roleList: Role[] = configs.roleList;


export const loop = function () {
    console.log("=============================================================");
    
    for (let role of roleList) {
        const creepsOfRole = worldStateModule.getAllMyCreepsWithRole(role.roleName);
        if (role.creepNum > creepsOfRole.length) {
            const spawn = worldStateModule.getAllMySpawnsWithFilter()[0];
            const spawnCode = spawn.spawnCreepFromType(role.creepType, undefined, {
                memory: {
                    type: role.creepType,
                    role: {
                        roleName: role.roleName,
                    }
                }
            });
            console.log(`Spawn type [${role.creepType.name}] for role [${role.roleName}]: [${spawnCode}]`);
        }

        for (let creep of creepsOfRole) {
            role.runRole(creep);
            actModule.work(creep);
        }

    }
    console.log("=============================================================");
}

