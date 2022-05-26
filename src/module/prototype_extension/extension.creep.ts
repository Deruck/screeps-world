import { ReturnCode, defaultMoveToOpts } from "@/const";



export const createCreepExtensionModule = function (ctx: CreepExtensionModuleContext): CreepExtensionModule {

    /*******************************************************************************************
     * 
     *******************************************************************************************/
    const creepExtension: CreepExtension = {

        moveToTarget(targetPos: RoomPosition, range: number, moveToOpts: MoveToOpts = defaultMoveToOpts) {
            if (this.pos.inRangeTo(targetPos, range)) {
                return ReturnCode.DONE;
            } else {
                var code = this.moveTo(targetPos, moveToOpts);
                if (code == -5 || code == -2) {
                    this.say(`🔎❌`);
                } else if (code == -11) {
                    this.say(`🛌`);
                }
                return ReturnCode.PROCESSING;
            }
        },

        actLog(content: string): void {
            const taskInfo = this.memory.task ? ` - ${this.memory.task.taskType}` : '';
            const actInfo = this.memory.act ? ` - ${this.memory.act.actType}` : '';
            console.log(this.name + taskInfo + actInfo + ": " + content);   
        },

    }

    /*******************************************************************************************
     * 
     *******************************************************************************************/

    const addCreepExtension = function() {
        _.assign(Creep.prototype, creepExtension);
    }

    return {
        addCreepExtension: addCreepExtension
    }
}