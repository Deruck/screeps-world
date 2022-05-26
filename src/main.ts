import { extensionModule } from "./interface/extension.module";
import { MemoryController } from "./module/memory/memoryController";
import { configs } from "./config";
import { worldStateModule } from "./interface/world_state.module";
import { actModule } from "./interface/act.module";
import { ReturnCode } from "./const";
import { globalMemoryModule } from "./interface/memory.global.module";




console.log(`==============================================`);
console.log(`Global Reset  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
console.log(`==============================================`);

global.ticksFromLastReset = 0;
global.reusePath = 3;
extensionModule.addPrototypeExtension();
MemoryController.removeDeadCreepMemory();
const roleList: Role[] = configs.roleList;


export const loop = function() {
    console.log(`======================================tick: ${Game.time}, reset: ${global.ticksFromLastReset}`);
    let ifPreRoleHaveMeetCreepNumber: boolean = true;
    for (let role of roleList) {
        const creepsOfRole = worldStateModule.getAllMyCreepsWithRole(role.roleName);
        if (ifPreRoleHaveMeetCreepNumber) {
            if (role.creepNum > creepsOfRole.length) {
                ifPreRoleHaveMeetCreepNumber = false;
                const spawn = worldStateModule.getAllMySpawnsWithFilter()[0];
                const spawnCode = spawn.spawnCreepFromType(role.creepType, undefined, {
                    memory: {
                        type: role.creepType,
                        role: {
                            roleName: role.roleName,
                        }
                    }
                });
                if (spawnCode == ReturnCode.SUCCESS) {
                    console.log(`Spawn type [${role.creepType.name}] for role [${role.roleName}]: [${spawnCode}]`);
                }
            } else {
                ifPreRoleHaveMeetCreepNumber = true;
            }
        }

        for (let creep of creepsOfRole) {
            role.runRole(creep);
            actModule.work(creep);
        }

    }

    globalMemoryModule.resetCache();
    global.ticksFromLastReset++;
    console.log(`================================================================`);
}



// export const loop = errorMapper(() => {

// })