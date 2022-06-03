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
global.reusePath = 5;
extensionModule.addPrototypeExtension();
MemoryController.removeDeadCreepMemory();
const roleList: Role[] = configs.roleList;


export const loop = function () {
    /*****************************************************************************************
     * global set
     *****************************************************************************************/
    global.structures = {};
    global.structures.room = Game.rooms["W51S27"];
    const room = global.structures.room;

    global.ticksFromLastReset++;
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }

    global.structures.mySpawns = worldStateModule.getAllMySpawns();
    global.structures.sources = new Map([
        // @ts-ignore
        ["top", worldStateModule.getObjectById("5bbcaa559099fc012e6312b1")], 
        // @ts-ignore
        ["bottom", worldStateModule.getObjectById("5bbcaa559099fc012e6312b3")]
    ])

    /*****************************************************************************************
     * role
     *****************************************************************************************/
     var roleNum: Map<string, number> = new Map();
     let ifPreRoleHaveMeetCreepNumber: boolean = true;
     for (let role of roleList) {
         const creepsOfRole = worldStateModule.getAllMyCreepsWithRole(role.roleName);
         roleNum.set(role.roleName, creepsOfRole.length);
         if (ifPreRoleHaveMeetCreepNumber) {
             var renewCreep: Creep = undefined;
             if (role.creepNum >= creepsOfRole.length) {
                 for (let creep of creepsOfRole) {
                     // 两倍spawn时间+30tick到岗时间缓冲
                     if (creep.ticksToLive < role.creepType.bodyParts.length * 3 * 2 + 30 && !creep.memory.renewed) {
                         renewCreep = creep;
                     }
                 }
             }
             if (role.creepNum > creepsOfRole.length || renewCreep) {
                 ifPreRoleHaveMeetCreepNumber = false;
                 const spawn = global.structures.mySpawns[0];
                 const spawnCode = spawn.spawnCreepFromType(role.creepType, undefined, {
                     memory: {
                         type: role.creepType,
                         role: {
                             roleName: role.roleName,
                         }
                     }
                 });
                 console.log(`Spawn type [${role.creepType.name}] for role [${role.roleName}]: [${spawnCode}]`);
                 if (role.creepNum <= creepsOfRole.length && spawnCode == ReturnCode.SUCCESS && renewCreep) {
                     renewCreep.memory.renewed = true;
                 }
             } else {
                 ifPreRoleHaveMeetCreepNumber = true;
             }
         }
 
         for (let creep of creepsOfRole) {
             creep.room.visual.circle(creep.pos, {
                 radius: 0.6,
                 opacity: 0.5,
                 stroke: role.color,
                 fill: "transparent",
                 strokeWidth: 0.2
             });
             try {
                 role.runRole(creep);
             actModule.work(creep);
             } catch(err) {
                 console.log(`[ERROR]: ${err}`);
             }
         }
    }
    




    /*****************************************************************************************
     * others
     *****************************************************************************************/

    globalMemoryModule.resetCache();
    global.ticksFromLastReset++;
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }

    const attackEvents = _.filter(room.getEventLog(), { event: EVENT_ATTACK });
    if (attackEvents.length > 0 && !room.controller.safeMode && room.controller.safeModeAvailable > 0 && !room.controller.safeModeCooldown) {
        room.controller.activateSafeMode();
    }


    /*****************************************************************************************
     * print info
     *****************************************************************************************/

    console.log(`\n\n--------------------Info--------------------`)
    console.log(`tick: ${Game.time}`);
    console.log(`reset: ${global.ticksFromLastReset}`);
    console.log(`room energy: ${room.energyAvailable}/${room.energyCapacityAvailable} (${(room.energyAvailable / room.energyCapacityAvailable * 100).toFixed(2)}%)`);
    const usedCpu = Game.cpu.getUsed();
    console.log(`use cpu: ${usedCpu.toFixed(2)}/20 (${(usedCpu / 20 * 100).toFixed(2)}%)`);
    console.log(`bucket: ${Game.cpu.bucket}/10000 (${(Game.cpu.bucket / 10000 * 100).toFixed(2)}%)`);
    
    // const storageUse = global.structures.coreStore.store.getUsedCapacity();
    // const storageTotal = global.structures.coreStore.store.getCapacity();
    // console.log(`storage: ${storageUse}/${storageTotal} (${(storageUse / storageTotal * 100).toFixed(2)}%)`);


    const level = room.controller.level;
    const progress = room.controller.progress;
    const progressTotal = room.controller.progressTotal;
    console.log(`controller: level${level} ${progress}/${progressTotal} (${(progress / progressTotal * 100).toFixed(2)}%)`);
    console.log(`creeps: `);

    for (let [roleName, num] of roleNum) {
        console.log(` - ${roleName}: ${roleNum.get(roleName)}`);
    }
    console.log(`--------------------------------------------\n\n`)
    console.log(`================================================================================`);
}