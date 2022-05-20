interface CreepMemory {
    /**
     * 该 creep 的角色
     */
    role: string,
    upgrading?: boolean,
    preempt_disable?: boolean
    move?: {
        path: RoomPosition[],
        target: RoomPosition,
    }
}

interface BodyParts {
    WORK: number,
    MOVE: number,
    CARRY: number,
    ATTACK: number,
    RANGED_ATTACK: number,
    HEAL: number,
    CLAIM: number,
}

interface Memory {
    /**记录一次性脚本是否已执行 */
    oneTimeExec: boolean,
}

