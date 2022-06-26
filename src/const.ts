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
    BUILD_CONSTRUCTION = "buildConstruction",
    REPAIR_STRUCTURE = "repairStructure"
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

export enum Color {
    HARVEST = "#b2bec3",
    STORE = "#fdcb6e",
    WITHDRAW = "#ffeaa7",
    BUILD = "#0984e3",
    UPGRADE = "#81ecec",
    REPAIR = "#74b9ff",
    HEAL = "#55efc4",
    ATTACK = "#d63031",

    CARRIER = "#fed330",
    WORKER = "#487eb0",
    UPGRADER = "#55efc4",
    HARVESTER = "#e58e26",
    TRANSFERER = "#95a5a6"
}

export enum CreepTypeNames {
    /**初始类型，用于初始建设的全能角色 */
    STARTER = "starter",
    /**全能类型，用于upgrade、build、repair等同时需要move、carry、work的角色*/
    WORKER = "worker",
    /**特化采集者，all in work， 每个source最多需要 容量/300/2 个work部件*/
    HARVESTER = "harvester",
    /**特化搬运者, 1move + 2carry, 主要在road上行走*/
    CARRIER = "carrier",
    TRANSFERER = "transferer",
    RANGED_ATTACKER = "ranged_attacker",
    REPAIRER = "repairer"
}

/*****************************************************************************************
 * Interface
 *****************************************************************************************/

declare global {
    type AnyResourceObj = Source | Mineral | Deposit;
    type AnyResourceObjId = Id<Source> | Id<Mineral> | Id<Deposit>;

}