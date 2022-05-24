export enum ReturnCode {
    DONE = 100,
    PROCESSING = 101,
    FAILED = 102,
}
export enum TaskTypes {
    HARVEST_TO_STORE,
    HARVEST_TO_UPGRADE,
}

export enum ActTypes {
    HARVEST_ENERGY = "harvestEnergy",
    STORE_RESOURCE = "storeResource",
    UPGRADE = "upgrade",
    WITHDRAW_RESOURCE = "withdrawResource"
}

export enum CreepTypeNames {
    /**初始类型，用于初始建设的全能角色 */
    STARTER = "starter",
    /**全能类型，用于upgrade、build、repair等同时需要move、carry、work的角色*/
    WORKER = "worker",
    /**特化采集者，all in work， 每个source最多需要 容量/300/2 个work部件*/
    HARVESTER = "harvester",
    /**特化搬运者, 1move + 2carry, 主要在road上行走*/
    CARRIER = "carrier"
}
