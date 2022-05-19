export class CreepType {
    name: string;
    bodyParts: BodyParts;
    constructor(name: string, bodyParts: BodyParts) {
        this.name = name;
        this.bodyParts = bodyParts;
    }
}

export enum creepTypeNames {
    harvester = "harvester",
    upgrader = "upgrader"
}

export const harvester: CreepType = new CreepType(creepTypeNames.harvester,
    {
        WORK: 1,
        MOVE: 1,
        CARRY: 1,
        ATTACK: 0,
        RANGED_ATTACK: 0,
        HEAL: 0,
        CLAIM: 0,
    })

export const upgrader: CreepType = new CreepType(creepTypeNames.upgrader,
    {
        WORK: 1,
        MOVE: 1,
        CARRY: 1,
        ATTACK: 0,
        RANGED_ATTACK: 0,
        HEAL: 0,
        CLAIM: 0,
    })

