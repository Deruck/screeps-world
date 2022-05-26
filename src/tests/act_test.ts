import { actModule } from "@/interface/act.module";

export const actTest = function () {
    const creep1 = Game.creeps["creep1"];
    const room = Game.rooms['sim'];
    const source = creep1.room.find(FIND_SOURCES)[0];
    // @ts-ignore
    const storage: StructureStorage = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } })[0];
    // const constructionSite: ConstructionSite = creep1.room.find(FIND_MY_CONSTRUCTION_SITES)[0];

    console.log(`harvest: ${actModule.harvestResource(creep1, source.id)}`);
    console.log(`store: ${actModule.storeResource(creep1, storage.id, RESOURCE_ENERGY)}`);
}