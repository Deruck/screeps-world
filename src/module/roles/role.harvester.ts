export class HarvesterMethods {
    static run(creep: Creep, source: Source,reusePath: number): void {
        if (!creep.memory.busy) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                creep.harvestToStore(source, targets[0], {
                    visualizePathStyle: { stroke: '#ffaa00' },
                    reusePath: reusePath
                })
            } else {
                creep.harvestToUpgrade(source, {
                    visualizePathStyle: { stroke: '#ffffff' },
                    reusePath: reusePath
                })
            }
        } else if (!(creep.harvestToStore === undefined)) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            var code = creep.harvestToStore(source, targets[0], {
                visualizePathStyle: { stroke: '#ffaa00' },
                reusePath: reusePath
            })
        } else {
            creep.harvestToUpgrade(source, {
                visualizePathStyle: { stroke: '#ffffff' },
                reusePath: reusePath
            })
        }
    }
}