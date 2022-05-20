import { addPrototypeExtension } from "./prototype-extension/extension"

addPrototypeExtension();
export const loop = function () {
    var creep1 = Game.creeps["creep1"];
    var spawn1 = Game.spawns["Spawn1"];
    var storage = creep1.room.find(FIND_STRUCTURES, {
        filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER }
    })[0];
    var source = creep1.room.find(FIND_SOURCES)[0];
    console.log(creep1.hearvestToStore(source, storage, {
        reusePath: 10,
        visualizePathStyle: { stroke: "#ffffff" }
    }));

}

