import { ReturnCode, ActTypes } from "@/const";

export const createActModule = function (context: ActModuleContext): ActModule {
    const harvestEnergy: ActCreator = (actOpts) => ({
        act_name: ActTypes.HARVEST_ENERGY,
    
        check(creep: Creep) {
            var ifFreeCap = creep.store.getFreeCapacity() > 0;
            return ifFreeCap;
        },
    
        prepare(creep: Creep) {
            creep.memory.act[this.act_name] = 0;
            return true;
        },
    
        exec(creep: Creep) {
            // 初始
            if (creep.memory.act[this.act_name] == 0) {
                creep.say(`🚴‍♀️`);
                creep.memory.act[this.act_name] = 1;
            }
            // 去往source
            if (creep.memory.act[this.act_name] == 1) {
                if (creep.moveToTarget(actOpts.source.pos, 1, actOpts.moveToOpts) == ReturnCode.DONE) {
                    creep.say(`⛏`);
                    creep.memory.act[this.act_name] = 2;
                }
            }
            // 开采
            if (creep.memory.act[this.act_name] == 2) {
                var freeCap = creep.store.getFreeCapacity();
                if (freeCap > 0) {
                    creep.harvest(actOpts.source);
                } else {
                    creep.say(`🆗`);
                    return true;
                }
            }
            return false;
        },
    
        end(creep) {
            delete creep.memory.act[this.act_name];
            return true;
        },
    });
    
    const storeEnergy: ActCreator = (actOpts) => ({
        act_name: ActTypes.STORE_ENERGY,
    
        check(creep: Creep) {
            var ifHaveEnergy = creep.store[RESOURCE_ENERGY] > 0;
            return ifHaveEnergy;
        },
    
        prepare(creep: Creep) {
            creep.memory.act[this.act_name] = 0;
            return true;
        },
    
        exec(creep: Creep) {
            // 初始
            if (creep.memory.act[this.act_name] == 0) {
                creep.say(`🚴‍♀️`);
                creep.memory.act[this.act_name] = 1;
            }
            // 去往store
            if (creep.memory.act[this.act_name] == 1) {
                if (creep.moveToTarget(actOpts.store.pos, 1, actOpts.moveToOpts) == ReturnCode.DONE) {
                    creep.say(`🔄`);
                    creep.memory.act[this.act_name] = 2;
                }
            }
            // transfer
            if (creep.memory.act[this.act_name] == 2) {
                var code = creep.transfer(actOpts.store, RESOURCE_ENERGY);
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
            delete creep.memory.act[this.act_name];
            return true;
        },
    });
    
    const upgrade: ActCreator = (actOpts) => ({
        act_name: ActTypes.UPGRADE,
    
        check(creep: Creep) {
            var ifHaveEnergy = creep.store[RESOURCE_ENERGY] > 0;
            return ifHaveEnergy;
        },
    
        prepare(creep: Creep) {
            creep.memory.act[this.act_name] = 0;
            return true;
        },
    
        exec(creep: Creep) {
            // 初始
            if (creep.memory.act[this.act_name] == 0) {
                creep.say(`🚴‍♀️`);
                creep.memory.act[this.act_name] = 1;
            }
            // 去往controller
            if (creep.memory.act[this.act_name] == 1) {
                if (creep.moveToTarget(creep.room.controller.pos, 3, actOpts.moveToOpts) == ReturnCode.DONE) {
                    creep.say(`🔄`);
                    creep.memory.act[this.act_name] = 2;
                }
            }
            // upgrade
            if (creep.memory.act[this.act_name] == 2) {
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
            delete creep.memory.act[this.act_name];
            return true;
        },
    });
    
    const actMenu: Map<ActTypes, ActCreator> = new Map([
        [ActTypes.HARVEST_ENERGY, harvestEnergy],
        [ActTypes.STORE_ENERGY, storeEnergy],
        [ActTypes.UPGRADE, upgrade]
    ])

    return {
        getAct: (actName: ActTypes) => actMenu[actName]
    }
}




