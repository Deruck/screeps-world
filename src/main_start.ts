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
    global.ifRoomLackEnergy = global.structures.room.energyAvailable / global.structures.room.energyCapacityAvailable < 0.8;
    const room = global.structures.room;

    // // @ts-ignore
    // global.structures.myTowers = global.structures.room.find(FIND_MY_STRUCTURES, {
    //     filter: {structureType: STRUCTURE_TOWER}
    // })
    global.structures.myTowers = [
        // @ts-ignore
        Game.getObjectById("62a20920c35f7b33900f535b"), 
        // @ts-ignore
        Game.getObjectById("62b7dfbe367151763e813801"), 
        // @ts-ignore
        Game.getObjectById("629dbb6ec35f7ba64f0e09ff"), 
    ]

    global.structures.mySpawns = worldStateModule.getAllMySpawns();
    global.structures.sources = new Map([
        // @ts-ignore
        ["top", worldStateModule.getObjectById("5bbcaa559099fc012e6312b1")], 
        // @ts-ignore
        ["bottom", worldStateModule.getObjectById("5bbcaa559099fc012e6312b3")]
    ])

    global.structures.myStores = new Map([
        // @ts-ignore
        ["core", worldStateModule.getObjectById("629b9ac28b83200dbeb60eba")],
    ])

    global.structures.myLinks = new Map([
        // @ts-ignore
        ["top", worldStateModule.getObjectById("629dc245d1ec5375502f6494")],
        // @ts-ignore
        ["bottom", worldStateModule.getObjectById("629dca31ecb35e743280d6a9")],
        // @ts-ignore
        ["core", worldStateModule.getObjectById("62a34db72ba9c657aeef8ff0")],
    ])

    /*****************************************************************************************
     * role
     *****************************************************************************************/
     var roleNum: Map<string, number[]> = new Map();
     let ifPreRoleHaveMeetCreepNumber: boolean = true;
     for (let role of roleList) {
         const creepsOfRole = worldStateModule.getAllMyCreepsWithRole(role.roleName);
         roleNum.set(role.roleName, [creepsOfRole.length, role.creepNum]);
         if (ifPreRoleHaveMeetCreepNumber) {
             var renewCreep: Creep = undefined;
             if (role.creepNum >= creepsOfRole.length) {
                 for (let creep of creepsOfRole) {
                     // 1.2倍spawn时间+30tick到岗时间缓冲
                     if (creep.ticksToLive < role.creepType.bodyParts.length * 3 * 1.2 + 30 && !creep.memory.renewed) {
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
     * Tower
     *****************************************************************************************/

    // var hostileCreeps = global.structures.room.find(FIND_HOSTILE_CREEPS);
    // if (hostileCreeps.length > 0) {
    //     // const healCreep = global.structures.room.find(FIND_HOSTILE_CREEPS, {
    //     //     filter: (creep: Creep) => creep.getActiveBodyparts(HEAL) > 0
    //     // });
    //     // hostileCreeps = healCreep.length > 0 ? healCreep : hostileCreeps;
    //     for (let tower of global.structures.myTowers) {
    //         tower.attack(hostileCreeps[0]);
    //     }
    // } else {
    //     var repairStructures = worldStateModule.getRepairStructures(global.structures.room, 0.8, [STRUCTURE_WALL, STRUCTURE_RAMPART]);
    //     if (repairStructures.length == 0) {
    //         globalMemoryModule.getGlobalMemory().cache.repairStructure.cache = new Map();
    //         var front: Structure<StructureConstant>[] = [
    //             // @ts-ignore
    //             Game.getObjectById("62a1ca07ccb1846ef94e39bd"),
    //             // @ts-ignore
    //             Game.getObjectById("62a1ca1586de715878e987d1"),
    //             // @ts-ignore
    //             Game.getObjectById("62a1ca0d4d1dab41edd64c6a"),
    //         ] 
    //         repairStructures = _.filter(front, (structure: AnyStructure) => structure.hits / structure.hitsMax <= 0.8);
    //     }
    //     if (repairStructures.length == 0) {
    //         globalMemoryModule.getGlobalMemory().cache.repairStructure.cache = new Map();
    //         repairStructures = worldStateModule.getRepairStructures(global.structures.room, 3e-3, [STRUCTURE_WALL]);
    //     }
    //     if (repairStructures.length == 0 && !global.ifRoomLackEnergy) {
    //         globalMemoryModule.getGlobalMemory().cache.repairStructure.cache = new Map();
    //         repairStructures = worldStateModule.getRepairStructures(global.structures.room, 1e-3, []);
    //     }
    //     var lowestStructure: Structure;
    //     // for (let structure of repairStructures) {
    //     //     if (!lowestStructure || structure.hits / structure.hitsMax < lowestStructure.hits / lowestStructure.hitsMax) {
    //     //         lowestStructure = structure;
    //     //     }
    //     // }
    //     for (let structure of repairStructures) {
    //         if (!lowestStructure || structure.hits < lowestStructure.hits) {
    //             lowestStructure = structure;
    //         }
    //     }
    //     for (let tower of global.structures.myTowers) {
    //         if(tower.store[RESOURCE_ENERGY] / 1000 >= 0.5)
    //             tower.repair(lowestStructure);
    //     }
    // }
    var repairStructures = worldStateModule.getRepairStructures(global.structures.room, 0.8, [STRUCTURE_WALL, STRUCTURE_RAMPART]);
    if (repairStructures.length == 0) {
        globalMemoryModule.getGlobalMemory().cache.repairStructure.cache = new Map();
        var front: Structure<StructureConstant>[] = [
            // @ts-ignore
            Game.getObjectById("62a1ca07ccb1846ef94e39bd"),
            // @ts-ignore
            Game.getObjectById("62a1ca1586de715878e987d1"),
            // @ts-ignore
            Game.getObjectById("62a1ca0d4d1dab41edd64c6a"),
        ] 
        repairStructures = _.filter(front, (structure: AnyStructure) => structure.hits / structure.hitsMax <= 0.8);
    }
    if (repairStructures.length == 0) {
        globalMemoryModule.getGlobalMemory().cache.repairStructure.cache = new Map();
        repairStructures = worldStateModule.getRepairStructures(global.structures.room, 3e-3, [STRUCTURE_WALL]);
    }
    if (repairStructures.length == 0 && !global.ifRoomLackEnergy) {
        globalMemoryModule.getGlobalMemory().cache.repairStructure.cache = new Map();
        repairStructures = worldStateModule.getRepairStructures(global.structures.room, 1e-3, []);
    }
    var lowestStructure: Structure;
    // for (let structure of repairStructures) {
    //     if (!lowestStructure || structure.hits / structure.hitsMax < lowestStructure.hits / lowestStructure.hitsMax) {
    //         lowestStructure = structure;
    //     }
    // }
    for (let structure of repairStructures) {
        if (!lowestStructure || structure.hits < lowestStructure.hits) {
            lowestStructure = structure;
        }
    }
    for (let tower of global.structures.myTowers) {
        if(tower.store[RESOURCE_ENERGY] / 1000 >= 0.5)
            tower.repair(lowestStructure);
    }

    /*****************************************************************************************
     * links
     *****************************************************************************************/
    const linkBottom = global.structures.myLinks.get("bottom");
    const linkTop = global.structures.myLinks.get("top");
    const linkCore = global.structures.myLinks.get("core");
    if (linkBottom.store[RESOURCE_ENERGY] > 100 && !linkBottom.cooldown) {
        linkBottom.transferEnergy(linkCore);
    }
    if (linkTop.store[RESOURCE_ENERGY] > 100 && !linkTop.cooldown) {
        linkTop.transferEnergy(linkCore);
    }


    /*****************************************************************************************
     * others
     *****************************************************************************************/

    globalMemoryModule.resetCache();
    global.ticksFromLastReset++;
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }

    // const attackEvents = _.filter(room.getEventLog(), { event: EVENT_ATTACK, data: { attackType: EVENT_ATTACK_TYPE_RANGED }});
    // if (attackEvents.length > 0) {
    //     Game.notify(`Attack Event.`, 1);
    // }
    // if (attackEvents.length > 0 && !room.controller.safeMode && room.controller.safeModeAvailable > 0 && !room.controller.safeModeCooldown) {
    //     room.controller.activateSafeMode();
    // }


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
    
    const storage = global.structures.myStores.get("core");
    const storageUse = storage.store.getUsedCapacity();
    const storageTotal = storage.store.getCapacity();
    console.log(`storage: ${storageUse}/${storageTotal} (${(storageUse / storageTotal * 100).toFixed(2)}%)`);


    const level = room.controller.level;
    const progress = room.controller.progress;
    const progressTotal = room.controller.progressTotal;
    console.log(`controller: level${level} ${progress}/${progressTotal} (${(progress / progressTotal * 100).toFixed(2)}%)`);
    console.log(`creeps: `);

    for (let [roleName, nums] of roleNum) {
        console.log(` - ${roleName}: ${nums[0]}/${nums[1]}`);
    }
    console.log(`--------------------------------------------\n\n`)
    console.log(`================================================================================`);
}