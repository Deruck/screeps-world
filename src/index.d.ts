interface Memory {
    /**记录一次性脚本是否已执行 */
    oneTimeExec: boolean,
}

interface CreepMemory {
    renewed?: boolean;
}

declare var ifRoomLackEnergy: boolean;
declare var structures: {
    myTowers?: StructureTower[],
    mySpawns?: StructureSpawn[],
    room?: Room,
    coreStore?: AnyStoreStructure,

    links?: Map<string, StructureLink>,
    sources?: Map<string, Source>, 
}
