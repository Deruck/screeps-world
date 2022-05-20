import { errorMapper } from "./utils/errorMapper"
import { harvester, creepTypeNames, upgrader } from "./creep_type";
import { MySpawn } from "./my_spawn";
import { HarvesterMethods } from "./roles/role.harvester";
import { getCreepNum } from "./utils";
import { UpgraderMethods } from "./roles/role.upgrader";
import { configs } from "./config"

console.log(`==============================================`);
console.log(`Global Reset  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
console.log(`==============================================`);
global.ticksFromLastReset = 0;




export const loop = errorMapper(() => {
    console.log(`================================tick: ${Game.time}`);
    var mySpawn1: MySpawn = new MySpawn("Spawn1");
    var remainingEnergy = mySpawn1.getStore()[RESOURCE_ENERGY];

    var harvesterNum = getCreepNum(creepTypeNames.harvester);
    console.log(`Harvesters: ${harvesterNum}`);
    var upgraderNum = getCreepNum(creepTypeNames.upgrader);
    console.log(`Upgraders: ${upgraderNum}`);
    console.log(`${mySpawn1.name} Remaining Energy: ${remainingEnergy}`);

    if (remainingEnergy) {
        if(harvesterNum < configs.role_management.harvester.num) {
            console.log("Try to spawn a harvest.");
            mySpawn1.spawnCreep(harvester);
        } else if(upgraderNum < configs.role_management.upgrader.num) {
            console.log("Try to spawn an upgrader.");
            mySpawn1.spawnCreep(upgrader);
        }
        
    }
    var sources = mySpawn1.spawn.room.find(FIND_SOURCES);
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == creepTypeNames.harvester) {
            HarvesterMethods.run(creep, sources[0], configs.reuse_path);
        } else if(creep.memory.role == creepTypeNames.upgrader) {
            UpgraderMethods.run(creep, sources[1], configs.reuse_path);
        }
    }

    console.log(`Ticks from last global reset: ${global.ticksFromLastReset}`);
    global.ticksFromLastReset++;
    console.log(`==============================================`);
})

// export const loop = function() {

// }