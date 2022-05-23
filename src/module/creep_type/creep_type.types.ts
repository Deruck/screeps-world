/**
 * 使用每个bodyPart类型的数量来刻画body，方便定义
 */
interface BodyPartsIndex {
    TOUGH?: number
    WORK?: number,
    CARRY?: number,
    ATTACK?: number,
    RANGED_ATTACK?: number,
    HEAL?: number,
    CLAIM?: number,
    MOVE?: number,
}

type BODY_PARTS = (
    WORK | MOVE | CARRY | ATTACK | RANGED_ATTACK | HEAL | CLAIM | TOUGH
)

interface CreepType {
    name: string;
    bodyPartsIndex: BodyPartsIndex;
    bodyParts: string[];
    cost: number;
}

