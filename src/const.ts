export enum ReturnCode {
    DONE = "[Done]",
    PROCESSING = "[Processing]",
    FAILED = "[Failed]",
    WAITING = "[Waiting]",
    SUCCESS = "[Success]",
    BUSY = "[Busy]",
    ERROR = "[Error]",
}

export enum TaskTypes {
    HARVEST_TO_STORE = "harvestToStore",
}

export enum ActTypes {
    HARVEST_RESOURCE = "harvestResource",
    STORE_RESOURCE = "storeResource",
    UPGRADE = "upgrade",
    WITHDRAW_RESOURCE = "withdrawResource",
    BUILD_CONSTRUCTION = "buildConstruction"
}

export const defaultMoveToOpts: MoveToOpts = {
    reusePath: 5, 
    visualizePathStyle: {
        stroke: "#ffffff",
    }
}

export enum Emoji {
    HARVEST = "⛏",
    STORE = "📤",
    WITHDRAW = "📥",
    MOVE = "🚴‍♂️",
    UPGRADE = "🧬",
    BUILD = "🧱",
    REPAIR = "🛠",
    SUCCESS = "✅",
    FAIL = "❌",
    WARNING = "❗",
    END = "⏹",
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

/*****************************************************************************************
 * Interface
 *****************************************************************************************/

declare global {
    type AnyResourceObj = Source | Mineral | Deposit;
    type AnyResourceObjId = Id<Source> | Id<Mineral> | Id<Deposit>;
}