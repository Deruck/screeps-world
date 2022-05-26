import { extensionModule } from "./interface/extension.module";
import { MemoryController } from "./module/memory/memoryController";
import { configs } from "./config";
import { worldStateModule } from "./interface/world_state.module";
import { actModule } from "./interface/act.module";




console.log(`==============================================`);
console.log(`Global Reset  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
console.log(`==============================================`);

global.ticksFromLastReset = 0;
extensionModule.addPrototypeExtension();
MemoryController.removeDeadCreepMemory();
const roleList: Role[] = configs.roleList;


export const loop = function() {
    console.log(`==================================================tick: ${Game.time}`);

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

    console.log(`Ticks from last global reset: ${global.ticksFromLastReset}`);
    global.ticksFromLastReset++;
    console.log(`================================================================`);
}



// export const loop = errorMapper(() => {

// })