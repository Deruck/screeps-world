import { UpgraderMethods } from "./role.upgrader";

export class HarvesterMethods {
    static run(creep: Creep, source: Source,reusePath: number): void {
        if (creep.store.getFreeCapacity() > 0 && !creep.memory.upgrading) {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {
                    visualizePathStyle: { stroke: '#ffaa00' },
                    reusePath: reusePath
                });
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0 && !creep.memory.upgrading) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { 
                        visualizePathStyle: { stroke: '#ffffff' },
                        reusePath: reusePath
                     });
                }
            } else {
                UpgraderMethods.run(creep, source, reusePath);
            }
        }
    }
}