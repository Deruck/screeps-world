import { addPrototypeExtension } from "./prototype-extension/extension"

addPrototypeExtension();
export const loop = function () {
    var creep1 = Game.creeps["creep1"];
    var source = creep1.room.find(FIND_SOURCES)[0];
    console.log(creep1.harvestToUpgrade(source, {
        reusePath: 10,
        visualizePathStyle: { stroke: "#ffffff" }
    }));

}

