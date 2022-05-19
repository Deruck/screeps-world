import { errorMapper } from "./utils/errorMapper"
import { harvester, creepTypeNames, upgrader } from "./creep_type";
import { MySpawn } from "./my_spawn";
import { HarvesterMethods } from "./role.harvester";
import { getCreepNum } from "./utils";
import { UpgraderMethods } from "./role.upgrader";




export const loop = errorMapper(() => {
    var mySpawn1: MySpawn = new MySpawn("Spawn1");
    var remainingEnergy = mySpawn1.getStore()[RESOURCE_ENERGY];

    var harvesterNum = getCreepNum(creepTypeNames.harvester);
    console.log(`Harvesters: ${harvesterNum}`);
    var upgraderNum = getCreepNum(creepTypeNames.upgrader);
    console.log(`Upgraders: ${upgraderNum}`);
    console.log(`${mySpawn1.name} Remaining Energy: ${remainingEnergy}`);

    if (remainingEnergy) {
        if(harvesterNum < 10) {
            console.log("Try to spawn a harvest.");
            mySpawn1.spawnCreep(harvester);
        } else if(upgraderNum < 3) {
            console.log("Try to spawn an upgrader.");
            mySpawn1.spawnCreep(upgrader);
        }
        
    }
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == creepTypeNames.harvester) {
            HarvesterMethods.run(creep);
        } else if(creep.memory.role == creepTypeNames.upgrader) {
            UpgraderMethods.run(creep, true);
        }
    }
})