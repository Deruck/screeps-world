import { Emoji, ReturnCode, TaskTypes } from "@/const";

export const createTaskModule = function (ctx: TaskModuleContext): TaskModule {
    const actModule = ctx.actModule;

    const work = function (this: TaskModule, creep: Creep): TaskWorkReturn {
        actModule.work(creep);
        if (!creep.memory.task) {
            this._resetTaskMemory(creep);
        }
        if (!creep.memory.task.busy) {
            return {
                taskType: undefined,
                returnCode: ReturnCode.WAITING
            }
        } else {
            return {
                taskType: creep.memory.task.taskType, 
                returnCode: this._runTask(creep)
            }
        }
    }

    const _resetTaskMemory = function (creep: Creep) {
        creep.memory.task = {
            status: 0,
            busy: false
        };
    };

    const _getTask = function (this: TaskModule, taskType: TaskTypes, taskOpts: TaskOpts): Task {
        return this._taskCreatorMenu.get(taskType)(taskOpts);
    }

    const _completeTask = function (this: TaskModule, creep: Creep, taskType: TaskTypes, taskOpts: TaskOpts): ReturnCode {
        if (!creep.memory.task) {
            this._resetTaskMemory(creep);
        }
        let task = this._getTask(taskType, taskOpts);
        // 如果没有task，便指派task
        if (!creep.memory.task.busy) {
            creep.memory.task.taskType = taskType;
            creep.memory.task.taskOpts = taskOpts;
            creep.memory.task.token = task.token;
        }
        // 如果在执行当前task，则继续执行，否则返回Busy
        if (
            taskType == creep.memory.task.taskType &&
            task.token == creep.memory.task.token
        ) {
            return this._runTask(creep);
        } else {
            return ReturnCode.BUSY;
        }
    }

    const _runTask = function (this: TaskModule, creep: Creep): ReturnCode {
        // 确保每个tick只会执行一个task
        const curTime = Game.time;
        if (creep.memory.task.lastTaskTime != curTime) {
            creep.memory.task.lastTaskTime = curTime;
        } else {
            return ReturnCode.BUSY;
        }
        let task = this._getTask(creep.memory.task.taskType, creep.memory.task.taskOpts);
        // check
        if (creep.memory.task.status == 0) {
            if (task.check(creep)) {
                creep.memory.task.busy = true;
                creep.memory.task.status = 1;
            } else {
                creep.actLog(`task check failed.`);
                this._resetTaskMemory(creep);
                return ReturnCode.FAILED; 
            }
        }
        // prepare
        if (creep.memory.task.status == 1) {
            if (task.prepare(creep)) {
                creep.memory.task.status = 2;
            }
        }
        // exec
        if (creep.memory.task.status == 2) {
            const execCode = task.exec(creep);
            if (execCode != ReturnCode.PROCESSING) {
                creep.memory.task.status = 3;
            } 
        }
        // check break condition
        if (Boolean(task.break_condition) && [1, 2].includes(creep.memory.task.status)) {
            if (!task.break_condition(creep)) {
                creep.say(Emoji.WARNING + Emoji.END);
                creep.actLog(`task break.`);
                creep.memory.task.status = 3;
            }
        }
        // end
        if (creep.memory.task.status == 3) {
            if (task.end(creep)) {
                this._resetTaskMemory(creep);
                return ReturnCode.DONE;
            }
        }
        return ReturnCode.PROCESSING;
    }

    const _createHarvestToStore: TaskCreator = function (taskOpts) {
        return {
            taskType: TaskTypes.HARVEST_TO_STORE,
            token: taskOpts.resourceObjId + taskOpts.toStoreId,

            resourceObjId: taskOpts.resourceObjId,
            toStoreId: taskOpts.toStoreId,
            resourceType: taskOpts.resourceType,
            reusePath: taskOpts.reusePath,
            amount: taskOpts.amount,

            check(creep: Creep) {
                const ifWorkBody = creep.getActiveBodyparts(WORK) > 0;
                const ifCarryBody = creep.getActiveBodyparts(CARRY) > 0;
                return ifWorkBody && ifCarryBody;
            },
        
            prepare(creep: Creep) {
                creep.actLog(`prepare`);
                creep.memory.task[this.taskType] = 0;
                return true;
            },

            exec(creep: Creep) {
                const reusePath = this.reusePath ? this.reusePath : 5;
                const moveToOpts: MoveToOpts = {
                    reusePath: reusePath,
                    visualizePathStyle: {
                        stroke: "#fdcb6e"
                    }
                }
                // harvest
                if (creep.memory.task[this.taskType] == 0) {
                    const harvestCode = actModule.harvestResource(creep, this.resourceObjId, moveToOpts);
                    if (harvestCode == ReturnCode.DONE) {
                        creep.actLog(`harvest success!`);
                        creep.memory.task[this.taskType] = 1;
                    } else {
                        return harvestCode;
                    }
                }
                // store
                if (creep.memory.task[this.taskType] == 1) {
                    const storeCode = actModule.storeResource(creep, this.toStoreId, this.resourceType, this.amount, moveToOpts)
                    return storeCode;
                }
                return ReturnCode.ERROR;
            },
        
            end(creep) {
                delete creep.memory.task[this.taskType];
                return true;
            },
        }
    };

    const harvestToStore = function (
        this: TaskModule,creep: Creep, fromSourceId: Id<Source>, toStoreId: Id<AnyStoreStructure>,
        resourceType: ResourceConstant, amount?: number, reusePath?: number
    ): ReturnCode {
        return this._completeTask(
            creep,
            TaskTypes.HARVEST_TO_STORE,
            {
                resourceObjId: fromSourceId,
                toStoreId: toStoreId,
                resourceType: resourceType, 
                amount: amount, 
                reusePath: reusePath
            }
        )
    }

    const _taskCreatorMenu: Map<TaskTypes, TaskCreator> = new Map([
        [TaskTypes.HARVEST_TO_STORE, _createHarvestToStore],
    ])




    return {
        work: work,
        _resetTaskMemory: _resetTaskMemory,
        _taskCreatorMenu: _taskCreatorMenu,
        _getTask: _getTask,
        _completeTask: _completeTask,
        _runTask: _runTask,
        harvestToStore: harvestToStore,
    }
}