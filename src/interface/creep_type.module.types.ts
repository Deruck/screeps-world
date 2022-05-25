import { CreepTypeNames } from "@/const"

declare global {
    interface CreepTypeModuleContext {

    }
    
    interface CreepTypeModule {
        getCreepType(creepTypeName: CreepTypeNames, bodyPartsIndex: BodyPartsIndex): CreepType;


    }
}

