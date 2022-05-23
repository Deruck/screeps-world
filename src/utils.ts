import { CreepTypeNames } from "./const";


export function getCreepNum(type: CreepTypeNames): number {
    var result = 0;
    for (var creepName in Game.creeps) {
        if (Game.creeps[creepName].memory.role == type) {
            result++;
        }
    }
    return result;
}