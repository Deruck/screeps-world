import { CreepType } from "./creep_type";

export class MySpawn {
    spawn: StructureSpawn;
    name: string;

    constructor(name: string) {
        this.name = name;
        this.spawn = Game.spawns[name];
        console.log(`Find spawn ${name}`)
    }

    getStore(): Store<"energy", false> {
        return this.spawn.store;
    }

    spawnCreep(creepType: CreepType): void {
        var bodyParts = [];
        for (var key in creepType.bodyParts) {
            var bodyPartNum = creepType.bodyParts[key]
            while (bodyPartNum--) {
                bodyParts.push(eval(key));
            }
        }
        var spawningState = this.spawn.spawnCreep(bodyParts, `${creepType.name}${Game.time}`, {
            memory: { role: creepType.name } 
        });
        if (spawningState == 0) {
            console.log(`Spawning creep: ${creepType.name}${Game.time}`);
            console.log(`Body Parts:`, bodyParts);
        } else {
            console.log(`Spawning Failed with Code ${spawningState}`);
        }
        
    }
}