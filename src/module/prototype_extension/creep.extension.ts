import { ReturnCode } from "@/const";

export const createCreepExtensionModule = function (context: CreepExtensionModuleContext): CreepExtensionModule {
    const getAct = context.getAct;

    /*******************************************************************************************
     * 
     *******************************************************************************************/
    const creepExtension: CreepExtension = {

        moveToTarget(targetPos, range, moveToOpts = undefined) {
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
    
        runAct(actType, actOpts) {
            const act = context.getAct(actType);
            if (!this.memory.act) {
                this.resetActMemory();
            }
            if (this.memory.task.status == 0) {
                if (task.check(this)) {
                    this.memory.task.status = 1;
                } else {
                    return ReturnCode.TASK_CHECK_FAIL;
                }
            } 
            if (Boolean(task.break_condition) && [1, 2].includes(this.memory.task.status)) {
                if (task.break_condition(this)) {
                    this.say(`❗⏹`);
                    this.memory.task.status = 3;
                }
            }
            if (this.memory.task.status == 1) {
                this.say(`🕐`);
                if (task.prepare(this)) {
                    this.say(`▶`)
                    this.memory.task.status = 2;
                }
            }
            if (this.memory.task.status == 2) {
                if (task.exec(this)) {
                    this.say(`🔚`);
                    this.memory.task.status = 3;
                }
            }
            if (this.memory.task.status == 3) {
                if (task.end(this)) {
                    this.resetTaskMemory();
                    return ReturnCode.TASK_DONE;
                }
            }
            return ReturnCode.TASK_PROCESSING;
        },
    
        _resetActMemory() {
            this.memory.act = {
                status: 0,
            };
        },
    
        // runTask(taskType, taskOpts) {
        //     const task = taskMenu[taskType](taskOpts);
        //     if (!this.memory.task) {
        //         this.resetTaskMemory();
        //     }
        //     if (this.memory.task.status == 0) {
        //         if (task.check(this)) {
        //             this.memory.task.status = 1;
        //         } else {
        //             return ReturnCode.TASK_CHECK_FAIL;
        //         }
        //     } 
        //     if (Boolean(task.break_condition) && [1, 2].includes(this.memory.task.status)) {
        //         if (task.break_condition(this)) {
        //             this.say(`❗⏹`);
        //             this.memory.task.status = 3;
        //         }
        //     }
        //     if (this.memory.task.status == 1) {
        //         this.say(`🕐`);
        //         if (task.prepare(this)) {
        //             this.say(`▶`)
        //             this.memory.task.status = 2;
        //         }
        //     }
        //     if (this.memory.task.status == 2) {
        //         if (task.exec(this)) {
        //             this.say(`🔚`);
        //             this.memory.task.status = 3;
        //         }
        //     }
        //     if (this.memory.task.status == 3) {
        //         if (task.end(this)) {
        //             this.resetTaskMemory();
        //             return ReturnCode.TASK_DONE;
        //         }
        //     }
        //     return ReturnCode.TASK_PROCESSING;
        // },
    
        resetTaskMemory() {
            this.memory.task = {
                status: 0,
            };
        },
    }

    /*******************************************************************************************
     * 
     *******************************************************************************************/

    const addCreepExtension = function() {
        _.assign(Creep.prototype, creepExtension);
    }

    return {
        addCreepExtionsion: addCreepExtension
    }
}