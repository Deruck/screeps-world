/**
 * 使用每个bodyPart类型的数量来刻画body，方便定义
 */
interface BodyPartsIndex {
    tough?: number
    work?: number,
    carry?: number,
    attack?: number,
    ranged_attack?: number,
    heal?: number,
    claim?: number,
    move?: number,
}

interface CreepType {
    name: string;
    bodyPartsIndex: BodyPartsIndex;
    bodyParts: BodyPartConstant[];
    cost: number;
}

interface CreepMemory {
    type: CreepType,
}
