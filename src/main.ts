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


export const loop = function () {
    global.structures = {};
    global.structures.room = Game.rooms["E4S49"];
    //@ts-ignore
    global.structures.myTowers = global.structures.room.find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_TOWER}
    })
    //@ts-ignore
    global.structures.coreStore = Game.getObjectById("6298da09875df976499f00bc");
    global.ifRoomLackEnergy = global.structures.room.energyAvailable / global.structures.room.energyCapacityAvailable < 0.8;
    //@ts-ignore
    global.structures.linkLeft = worldStateModule.getObjectById("6290b85dfd0df37b31c4d29b");
    //@ts-ignore
    global.structures.linkRight = worldStateModule.getObjectById("6290c8eb817aa31bb34e764a");
    //@ts-ignore
    global.structures.linkMiddle = worldStateModule.getObjectById("6298d70b9fd41683ac2801c2");




    const constructions = worldStateModule.getAllMyConstructionSites(global.structures.room);
    if (constructions.length == 0) {
        Game.notify(`Construction Done.`, 6 * 60);
    }
    

    /*****************************************************************************************
     * Role
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
                const spawn = worldStateModule.getAllMySpawns()[0];
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

    const hostileCreeps = global.structures.room.find(FIND_HOSTILE_CREEPS);
    if (hostileCreeps.length > 0) {
        for (let tower of global.structures.myTowers) {
            tower.attack(hostileCreeps[0]);
        }
    } else {
        var repairStructures = worldStateModule.getRepairStructures(global.structures.room, 0.8, [STRUCTURE_WALL, STRUCTURE_RAMPART]);
        if (repairStructures.length == 0) {
            globalMemoryModule.getGlobalMemory().cache.repairStructure.cache = new Map();
            repairStructures = worldStateModule.getRepairStructures(global.structures.room, 2e-4, [STRUCTURE_WALL]);
        }
        if (repairStructures.length == 0 && !global.ifRoomLackEnergy) {
            globalMemoryModule.getGlobalMemory().cache.repairStructure.cache = new Map();
            repairStructures = worldStateModule.getRepairStructures(global.structures.room, 2e-5, []);
        }
        var lowestStructure: Structure;
        for (let structure of repairStructures) {
            if (!lowestStructure || structure.hits / structure.hitsMax < lowestStructure.hits / lowestStructure.hitsMax) {
                lowestStructure = structure;
            }
        }
        for (let tower of global.structures.myTowers) {
            if(tower.store[RESOURCE_ENERGY] / 1000 >= 0.5)
                tower.repair(lowestStructure);
        }
    }

    /*****************************************************************************************
     * link
     *****************************************************************************************/
    const linkLeft: StructureLink = global.structures.linkLeft;
    const linkRight: StructureLink = global.structures.linkRight;
    const linkMiddle: StructureLink = global.structures.linkMiddle;
    if (linkLeft.store[RESOURCE_ENERGY] > 100 && !linkLeft.cooldown) {
        linkLeft.transferEnergy(linkMiddle);
    }
    if (linkRight.store[RESOURCE_ENERGY] > 100 && !linkRight.cooldown) {
        linkRight.transferEnergy(linkMiddle);
    }


    globalMemoryModule.resetCache();
    global.ticksFromLastReset++;
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }

    console.log(`\n\n--------------------Info--------------------`)
    console.log(`tick: ${Game.time}`);
    console.log(`reset: ${global.ticksFromLastReset}`);
    console.log(`room energy: ${global.structures.room.energyAvailable}/${global.structures.room.energyCapacityAvailable} (${(global.structures.room.energyAvailable / global.structures.room.energyCapacityAvailable * 100).toFixed(2)}%)`);
    const usedCpu = Game.cpu.getUsed();
    console.log(`use cpu: ${usedCpu.toFixed(2)}/20 (${(usedCpu / 20 * 100).toFixed(2)}%)`);
    console.log(`bucket: ${Game.cpu.bucket}/10000 (${(Game.cpu.bucket / 10000 * 100).toFixed(2)}%)`);
    
    const storageUse = global.structures.coreStore.store.getUsedCapacity();
    const storageTotal = global.structures.coreStore.store.getCapacity();
    console.log(`storage: ${storageUse}/${storageTotal} (${(storageUse / storageTotal * 100).toFixed(2)}%)`);


    const level = global.structures.room.controller.level;
    const progress = global.structures.room.controller.progress;
    const progressTotal = global.structures.room.controller.progressTotal;
    console.log(`controller: level${level} ${progress}/${progressTotal} (${(progress / progressTotal * 100).toFixed(2)}%)`);
    console.log(`creeps: `);

    for (let [roleName, num] of roleNum) {
        console.log(` - ${roleName}: ${roleNum.get(roleName)}`);
    }
    console.log(`--------------------------------------------\n\n`)
    console.log(`================================================================================`);
}



// export const loop = errorMapper(() => {

// })