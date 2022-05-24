import { ReturnCode, ActTypes } from "@/const";

export const createActModule = function (context: ActModuleContext): ActModule {
    const createHarvestEnergy: ActCreator = (actOpts) => ({
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
    
    const createStoreResource: ActCreator = (actOpts) => ({
        act_name: ActTypes.STORE_RESOURCE,
    
        check(creep: Creep) {
            const ifCreepHaveEnergy = actOpts.amount ?
                creep.store[actOpts.resourceType] >= actOpts.amount : 
                creep.store[actOpts.resourceType] > 0;
            const ifStoreHaveCap = actOpts.amount ? 
                actOpts.store.store.getFreeCapacity() >= actOpts.amount :
                actOpts.store.store.getFreeCapacity() > 0
            const ifResourceType = Boolean(creep.store[actOpts.resourceType]);
            return ifCreepHaveEnergy && ifStoreHaveCap && ifResourceType;
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
                const amount = actOpts.amount ? 
                    actOpts.amount : 
                    Math.min(actOpts.store.store.getFreeCapacity(), creep.store[actOpts.resourceType]);
                const code = creep.transfer(actOpts.store, actOpts.resourceType, amount);
                if (code == OK) {
                    creep.say(`🔄✅`);
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

        break_condition(creep) {
            var ifStoreCap = actOpts.amount ?
                actOpts.store.store.getFreeCapacity() > 0 :
                actOpts.store.store.getFreeCapacity() > actOpts.amount;
            return !ifStoreCap;
        }
    });
    
    const createUpgrade: ActCreator = (actOpts) => ({
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
                if (actOpts.upgradeTimes) {
                    var upgradeTimes = creep.memory.act.upgradeTimes === undefined ?
                    actOpts.upgradeTimes : creep.memory.act.upgradeTimes;
                    const energy = creep.store[RESOURCE_ENERGY];
                    if (energy > 0 && upgradeTimes > 0) {
                        creep.upgradeController(creep.room.controller);
                    } else {
                        creep.say(`🆙✅`);
                        return true;
                    }
                    console.log(upgradeTimes);
                    upgradeTimes--;
                    creep.memory.act.upgradeTimes = upgradeTimes;
                } else {
                    var energy = creep.store[RESOURCE_ENERGY];
                    if (energy > 0) {
                        creep.upgradeController(creep.room.controller);
                    } else {
                        creep.say(`🆙✅`);
                        return true;
                    }
                }
                
                
            }
            return false;
        },
    
        end(creep) {
            delete creep.memory.act[this.act_name];
            return true;
        },

        break_condition(creep) {

            return creep.store[RESOURCE_ENERGY] <= 0;
        }
    });

    const createWithdrawResource: ActCreator = (actOpts) => ({
        act_name: ActTypes.WITHDRAW_RESOURCE,
    
        check(creep: Creep) {
            var ifCreepHaveCap = creep.store.getFreeCapacity() > 0;
            if (actOpts.amount) {
                var ifStoreHaveResource = actOpts.store[actOpts.store[actOpts.resourceType]] >= actOpts.amount;
            } else {
                var ifStoreHaveResource = actOpts.store[actOpts.store[actOpts.resourceType]];
            }
            return ifCreepHaveCap && ifStoreHaveResource;
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
            // withdraw
            if (creep.memory.act[this.act_name] == 2) {
                var amount = actOpts.amount ? actOpts.amount :
                    Math.min(creep.store.getFreeCapacity(), actOpts.store[actOpts.resourceType]);
                const code = creep.withdraw(actOpts.store, actOpts.resourceType, amount);
                if (code == OK) {
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
    
    
    const actCreatorMenu: Map<ActTypes, ActCreator> = new Map([
        [ActTypes.HARVEST_ENERGY, createHarvestEnergy],
        [ActTypes.STORE_RESOURCE, createStoreResource],
        [ActTypes.UPGRADE, createUpgrade],
        [ActTypes.WITHDRAW_RESOURCE, createWithdrawResource]
    ])

    const getAct = function (actType: ActTypes, actOpts: ActOpts): Act {
        return actCreatorMenu.get(actType)(actOpts);
    }

    return {
        getAct: getAct,
    }
}




