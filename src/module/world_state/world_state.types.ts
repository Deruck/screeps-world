interface CreepMemory {
    worldState?: {
        closestConstructionSiteId?: Id<ConstructionSite>,
        closestAvailableStoreId?: Id<AnyStoreStructure>,
        closestRepairStructureId?: Id<AnyStructure>
    }
}