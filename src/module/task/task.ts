import { CreepTypeNames } from "@/const"
import { ReturnCode } from "@/const";


const TaskHarvesToStore: (taskOpts: TaskOpts) => Task = (taskOpts) => ({
    task_subject: new Set([CreepTypeNames.STARTER, CreepTypeNames.WORKER]),

    task_name: taskTypes.TaskHarvestToStore,

    check(creep: Creep) {
        var ifSourceValid = Boolean(Game.getObjectById(taskOpts.fromSourceId));
        var ifStoreValid = Boolean(Game.getObjectById(taskOpts.toStoreId));
        return ifSourceValid && ifStoreValid;
    },

    prepare(creep: Creep) {
        creep.memory.task[this.task_name] = 0;
        return true;
    },

    exec(creep: Creep) {
        var from = Game.getObjectById(taskOpts.fromSourceId);
        var to = Game.getObjectById(taskOpts.toStoreId);
        // 初始
        if (creep.memory.task[this.task_name] == 0) {
            if (creep.store.getUsedCapacity() > 0) {
                creep.say(`🚴‍♀️⬅`);
                creep.memory.task[this.task_name] = 3;
            } else {
                creep.say(`🚴‍♀️➡`);
                creep.memory.task[this.task_name] = 1
            }
        }
        // 去往source
        if (creep.memory.task[this.task_name] == 1) {
            if (creep.moveToTarget(from.pos, 1, taskOpts.moveToOpts) == ReturnCode.DONE) {
                creep.say(`⛏`);
                creep.memory.task[this.task_name] = 2;
            }
        }
        // 开采
        if (creep.memory.task[this.task_name] == 2) {
            var freeCap = creep.store.getFreeCapacity();
            if (freeCap > 0) {
                creep.harvest(from);
            } else {
                creep.say(`🚴‍♀️⬅`);
                creep.memory.task[this.task_name] = 3;
            }
        }
        // 去往store
        if (creep.memory.task[this.task_name] == 3) {
            if (creep.moveToTarget(to.pos, 1, taskOpts.moveToOpts) == ReturnCode.DONE) {
                creep.say(`🔄`);
                creep.memory.task[this.task_name] = 4;
            }
        }
        // transfer
        if (creep.memory.task[this.task_name] == 4) {
            var code = creep.transfer(to, RESOURCE_ENERGY);
            if ([-6, -8, 0].includes(code)) {
                creep.say(`🔄✅: ${code}`);
            } else {
                creep.say(`🔄❌: ${code}`);
            }
            return true;
        }
        return false;

    },

    end(creep) {
        delete creep.memory.task[this.task_name];
        return true;
    },

    break_condition(creep) {
        var to = Game.getObjectById(taskOpts.toStoreId);
        if (!(to) || to.store.getFreeCapacity() <= 0) {
            return true;
        }
        return false;
    }
});

const TaskHarvestToUpgrade: (taskOpts: TaskOpts) => Task = (taskOpts) => ({
    task_subject: new Set([CreepTypeNames.STARTER, CreepTypeNames.WORKER]),

    task_name: taskTypes.TaskHarvestToUpgrade,

    check(creep: Creep) {
        var ifSourceValid = Boolean(Game.getObjectById(taskOpts.fromSourceId));
        return  ifSourceValid;
    },

    prepare(creep: Creep) {
        creep.memory.task[this.task_name] = 0;
        return true;
    },

    exec(creep: Creep) {
        var from = Game.getObjectById(taskOpts.fromSourceId);
        // 初始
        if (creep.memory.task[this.task_name] == 0) { 
            if (creep.store.getUsedCapacity() > 0) {
                creep.say(`🚴‍♀️⬅`);
                creep.memory.task[this.task_name] = 3;
            } else {
                creep.say(`🚴‍♀️➡`);
                creep.memory.task[this.task_name] = 1
            }
        }
        // 去往source
        if (creep.memory.task[this.task_name] == 1) {
            if (creep.moveToTarget(from.pos, 1, taskOpts.moveToOpts) == ReturnCode.DONE) {
                creep.say(`⛏`);
                creep.memory.task[this.task_name] = 2;
            }   
        }
        // 开采
        if (creep.memory.task[this.task_name] == 2) {
            var freeCap = creep.store.getFreeCapacity();
            if (freeCap > 0) {
                creep.harvest(from);
            } else {
                creep.say(`🚴‍♀️⬅`);
                creep.memory.task[this.task_name] = 3;
            }
        }
        // 去往controller
        if (creep.memory.task[this.task_name] == 3) {
            if (creep.moveToTarget(creep.room.controller.pos, 3, taskOpts.moveToOpts) == ReturnCode.DONE) {
                creep.say(`🆙`);
                creep.memory.task[this.task_name] = 4;
            }   
        }
        // upgrade
        if (creep.memory.task[this.task_name] == 4) {
            var energy = creep.store[RESOURCE_ENERGY];
            if (energy > 0) {
                creep.upgradeController(creep.room.controller);
            } else {
                creep.say(`🆙✅`);
                return true;
            }
        }
        return false;

    },

    end(creep) {
        delete creep.memory.task[this.task_name];
        return true;
    },
})

export const taskMenu = {
    TaskHarvestToStore: TaskHarvesToStore,
    TaskHarvestToUpgrade: TaskHarvestToUpgrade
}

export enum taskTypes {
    Harvest = "Harvest",
    StoreEnergy = "StoreEnergy",
    Upgrade = "Upgrade",
    TaskHarvestToStore = "TaskHarvestToStore",
    TaskHarvestToUpgrade = "TaskHarvestToUpgrade"
}