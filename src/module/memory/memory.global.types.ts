declare var memory: GlobalMemory;

interface GlobalMemory {
    cache: {
        idToOject: Map<string, object>,
        roomToAvailableStore: {
            time: number,
            cache: Map<string, Map<ResourceConstant, AnyStoreStructure[]>> // cache.get(roomName).get(resourceType)
        },
        repairStructure: {
            time: number,
            cache: Map<string, Structure[]>
        }
    }
    
}