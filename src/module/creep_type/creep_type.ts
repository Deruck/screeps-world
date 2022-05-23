import { CreepTypeNames } from "@/const";

export const createCreepTypeModule = function (context: CreepTypeModuleContext): CreepTypeModule {
    const getCreepType = function (
        creepTypeName: CreepTypeNames,
        bodyPartsIndex: BodyPartsIndex
    ): CreepType {
        var bodyParts = [];
        var cost = 0;
        for (var key in bodyPartsIndex) {
            var bodyPartNum = bodyPartsIndex[key];
            while (bodyPartNum--) {
                bodyParts.push(key);
                cost += BODYPART_COST[key];
            }
        }
        return {
            name: creepTypeName, 
            bodyPartsIndex: bodyPartsIndex,
            bodyParts: bodyParts,
            cost: cost
        }
    }


    return {
        getCreepType: getCreepType
    }
}


