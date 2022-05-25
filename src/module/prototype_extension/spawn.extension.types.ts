import { ReturnCode } from "@/const";

declare global {
    interface SpawnExtension {
        spawnCreepFromType(this: StructureSpawn, creepType: CreepType, id?: string | number, spawnOpts?: SpawnOptions): ReturnCode;
        
        log(this: StructureSpawn, content: string): void;
    }

    interface StructureSpawn extends SpawnExtension {

    }
}

