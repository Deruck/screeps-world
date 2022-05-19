interface CreepMemory {
    /**
     * 该 creep 的角色
     */
    role: string,
    upgrading?: boolean
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