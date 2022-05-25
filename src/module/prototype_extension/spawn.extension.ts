import { ReturnCode } from "@/const";

export const createSpawnExtensionModule = function (ctx: SpawnExtensionModuleContext): SpawnExtensionModule {
    
    /*****************************************************************************************
     * 
     *****************************************************************************************/
    const spawnExtension: SpawnExtension = {
        spawnCreepFromType(creepType: CreepType, id?: string | number, spawnOpts?: SpawnOptions): ReturnCode {
            if (this.store[RESOURCE_ENERGY] < creepType.cost) {
                return ReturnCode.FAILED;
            }
            id = id ? id : Game.time;
            const name = creepType.name + id;
            if (spawnOpts) {
                spawnOpts.memory.type = creepType;
            } else {
                spawnOpts = { memory: { type: creepType } };
            }
            const code = this.spawnCreep(creepType.bodyParts, name, spawnOpts);
            if (code == OK) {
                return ReturnCode.SUCCESS;
            } else if (code == ERR_BUSY) {
                return ReturnCode.BUSY;
            } else {
                this.log(`Spawning failed with code: ${code}.`);
                return ReturnCode.FAILED;
            }

        },

        log(content: string) {
            console.log(`Spawn-${this.name}: ` + content);
        }


    }

    /*****************************************************************************************
     * 
     *****************************************************************************************/

    const addSpawnExtension = function() {
        _.assign(Spawn.prototype, spawnExtension);
    }

    return {
        addSpawnExtension: addSpawnExtension
    }
}