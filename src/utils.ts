import { creepTypeNames } from "./creep_type"

export function getCreepNum(type: creepTypeNames): number {
    var result = 0;
    for (var creepName in Game.creeps) {
        if (Game.creeps[creepName].memory.role == type) {
            result++;
        }
    }
    return result;
}