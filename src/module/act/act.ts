import { ReturnCode, ActTypes } from "@/const";

export const createActModule = function (context: ActModuleContext): ActModule {
    const work = function (this: ActModule, creep: Creep): ActWorkReturn {
        if (!creep.memory.act) {
            this._resetActMemory(creep);
        }
        if (!creep.memory.act.busy) {
            return {
                actType: undefined,
                returnCode: ReturnCode.WAITING
            }
        } else {
            return {
                actType: creep.memory.act.actType, 
                returnCode: this._runAct(creep)
            }
        }
    }
    
    const harvestResource = function(this: ActModule, creep: Creep, resourceObjId: Id<AnyResourceObj>, moveToOpts?: MoveToOpts): ReturnCode {
        return this._completeAct(creep, ActTypes.HARVEST_RESOURCE, {
            resourceObjId: resourceObjId,
            moveToOpts: moveToOpts
        })
    };
    
    const storeResource = function (this: ActModule, creep: Creep, storeId: Id<AnyStoreStructure>, resourceType: ResourceConstant, amount?: number, moveToOpts?: MoveToOpts): ReturnCode {
        return this._completeAct(creep, ActTypes.STORE_RESOURCE, {
            storeId: storeId,
            resourceType: resourceType,
            moveToOpts: moveToOpts,
            amount: amount
        });
    };
    
    const upgrade = function (this: ActModule, creep: Creep, times?: number, moveToOpts?: MoveToOpts): ReturnCode {
        return this._completeAct(creep, ActTypes.UPGRADE, {
            moveToOpts: moveToOpts,
            times: times
        })
    };
    
    const withdrawResource = function (this: ActModule, creep: Creep, storeId: Id<AnyStoreStructure>, resourceType: ResourceConstant, amount?: number, moveToOpts?: MoveToOpts): ReturnCode {
        return this._completeAct(creep, ActTypes.WITHDRAW_RESOURCE, {
            storeId: storeId,
            resourceType: resourceType,
            moveToOpts: moveToOpts,
            amount: amount
        });
    };
    
    const buildConstruction = function (this: ActModule, creep: Creep, constructionSiteId: Id<ConstructionSite>, times?: number, moveToOpts?: MoveToOpts): ReturnCode {
        return this._completeAct(creep, ActTypes.BUILD_CONSTRUCTION, {
            constructionSiteId: constructionSiteId,
            moveToOpts: moveToOpts,
            times: times
        })
    };


    const _createHarvestResource: ActCreator = function (actOpts) {
        return {
            actType: ActTypes.HARVEST_RESOURCE,
            token: actOpts.resourceObjId,
            resourceObjId: actOpts.resourceObjId,

            
            check(creep: Creep) {
                const resourceObj = Game.getObjectById(this.resourceObjId);
                const ifCreepCap = creep.store.getFreeCapacity() > 0; 
                // @ts-ignore
                if (resourceObj.depositType) { 
                    // @ts-ignore
                    var resourceType = resourceObj.depositType;
                    // @ts-ignore
                } else if (resourceObj.mineralType) {
                    // @ts-ignore
                    var resourceType = resourceObj.mineralType;
                } else {
                    var resourceType = RESOURCE_ENERGY;
                }

                const ifCreepHaveResource = creep.store[resourceType] > 0;
                return ifCreepCap || ifCreepHaveResource;
            },
        
            prepare(creep: Creep) {
                creep.memory.act[this.actType] = 0;
                return true;
            },
        
            exec(creep: Creep) {
                const resourceObj = Game.getObjectById(actOpts.resourceObjId);
                // 初始
                if (creep.memory.act[this.actType] == 0) {
                    if (creep.store.getFreeCapacity() <= 0) {
                        return true;
                    } else {
                        creep.say(`🚴‍♀️`);
                    creep.memory.act[this.actType] = 1;
                    }
                }
                // 去往source
                if (creep.memory.act[this.actType] == 1) {
                    if (creep.moveToTarget(resourceObj.pos, 1, actOpts.moveToOpts) == ReturnCode.DONE) {
                        creep.say(`⛏`);
                        creep.memory.act[this.actType] = 2;
                    }
                }
                // 开采
                if (creep.memory.act[this.actType] == 2) {
                    var freeCap = creep.store.getFreeCapacity();
                    if (freeCap > 0) {
                        creep.harvest(resourceObj);
                    }
                    if (freeCap <= 0) {
                        creep.say(`🆗`);
                        return true;
                    }
                }
                return false;
            },
        
            end(creep) {
                delete creep.memory.act[this.actType];
                return true;
            },
        }
    };
    
    const _createStoreResource: ActCreator = function (actOpts) {
        return {
            actType: ActTypes.STORE_RESOURCE,
            token: actOpts.storeId,
            storeId: actOpts.storeId,
        
            check(creep: Creep) {
                const store = Game.getObjectById(this.storeId);
                const ifCreepHaveEnergy = actOpts.amount ?
                    creep.store[actOpts.resourceType] >= actOpts.amount : 
                    creep.store[actOpts.resourceType] > 0;
                const ifStoreHaveCap = actOpts.amount ? 
                    store.store.getFreeCapacity() >= actOpts.amount :
                    store.store.getFreeCapacity() > 0
                const ifResourceType = Boolean(creep.store[actOpts.resourceType]);
                return ifCreepHaveEnergy && ifStoreHaveCap && ifResourceType;
            },
        
            prepare(creep: Creep) {
                creep.memory.act[this.actType] = 0;
                return true;
            },
        
            exec(creep: Creep) {
                const store = Game.getObjectById(this.storeId);
                // 初始
                if (creep.memory.act[this.actType] == 0) {
                    creep.say(`🚴‍♀️`);
                    creep.memory.act[this.actType] = 1;
                }
                // 去往store
                if (creep.memory.act[this.actType] == 1) {
                    if (creep.moveToTarget(store.pos, 1, actOpts.moveToOpts) == ReturnCode.DONE) {
                        creep.say(`🔄`);
                        creep.memory.act[this.actType] = 2;
                    }
                }
                // transfer
                if (creep.memory.act[this.actType] == 2) {
                    const amount = actOpts.amount ? 
                        actOpts.amount : 
                        Math.min(store.store.getFreeCapacity(), creep.store[actOpts.resourceType]);
                    const code = creep.transfer(store, actOpts.resourceType, amount);
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
                delete creep.memory.act[this.actType];
                return true;
            },
    
            break_condition(creep) {
                const store = Game.getObjectById(this.storeId);
                var ifStoreCap = actOpts.amount ?
                    store.store.getFreeCapacity() > actOpts.amount :
                    store.store.getFreeCapacity() > 0;
                    
                return ifStoreCap;
            }
        }
    };
    
    const _createUpgrade: ActCreator = function (actOpts) {
        return {
            actType: ActTypes.UPGRADE,
            token: "",
        
            check(creep: Creep) {
                var ifHaveEnergy = creep.store[RESOURCE_ENERGY] > 0;
                return ifHaveEnergy;
            },
        
            prepare(creep: Creep) {
                creep.memory.act[this.actType] = 0;
                return true;
            },
        
            exec(creep: Creep) {
                // 初始
                if (creep.memory.act[this.actType] == 0) {
                    creep.say(`🚴‍♀️`);
                    creep.memory.act[this.actType] = 1;
                }
                // 去往controller
                if (creep.memory.act[this.actType] == 1) {
                    if (creep.moveToTarget(creep.room.controller.pos, 3, actOpts.moveToOpts) == ReturnCode.DONE) {
                        creep.say(`🆙`);
                        creep.memory.act[this.actType] = 2;
                    }
                }
                // upgrade
                if (creep.memory.act[this.actType] == 2) {
                    if (actOpts.times) {
                        var times = creep.memory.act.times === undefined ?
                        actOpts.times : creep.memory.act.times;
                        const energy = creep.store[RESOURCE_ENERGY];
                        if (energy > 0 && times > 0) {
                            creep.upgradeController(creep.room.controller);
                        }
                        // console.log(times);
                        times--;
                        if (energy <= 0 || times <= 0) {
                            creep.say(`🆙✅`);
                            return true;
                        }
                        creep.memory.act.times = times;
                    } else {
                        var energy = creep.store[RESOURCE_ENERGY];
                        if (energy > 0) {
                            creep.upgradeController(creep.room.controller);
                        }
                        if (energy <= 0) {
                            creep.say(`🆙✅`);
                            return true;
                        }
                    }
                    
                    
                }
                return false;
            },
        
            end(creep) {
                delete creep.memory.act[this.actType];
                return true;
            },
    
            break_condition(creep) {
    
                return creep.store[RESOURCE_ENERGY] > 0;
            }
        }
    };

    const _createWithdrawResource: ActCreator = function (actOpts) {
        return {
            actType: ActTypes.WITHDRAW_RESOURCE,
            token: actOpts.storeId,

            storeId: actOpts.storeId,
            threshold: actOpts.amount ? actOpts.amount : 1,
        
            check(creep: Creep) {
                const store = Game.getObjectById(this.storeId);
                const ifCreepHaveCap = creep.store.getFreeCapacity() >= this.threshold;
                const ifStoreHaveResource = store.store[actOpts.resourceType] >= this.threshold;
                if (!ifCreepHaveCap) {
                    creep.actLog(`creep does not have enough free energy.`);
                }
                if (!ifStoreHaveResource) {
                    creep.actLog(`strore ${store.id} does not have enough capacity.`);
                }
                return ifCreepHaveCap && ifStoreHaveResource;
            },
        
            prepare(creep: Creep) {
                creep.memory.act[this.actType] = 0;
                return true;
            },
        
            exec(creep: Creep) {
                const store = Game.getObjectById(this.storeId);
                // 初始
                if (creep.memory.act[this.actType] == 0) {
                    creep.say(`🚴‍♀️`);
                    creep.memory.act[this.actType] = 1;
                }
                // 去往store
                if (creep.memory.act[this.actType] == 1) {
                    if (creep.moveToTarget(store.pos, 1, actOpts.moveToOpts) == ReturnCode.DONE) {
                        creep.say(`🔄`);
                        creep.memory.act[this.actType] = 2;
                    }
                }
                // withdraw
                if (creep.memory.act[this.actType] == 2) {
                    var amount = actOpts.amount ? actOpts.amount :
                        Math.min(creep.store.getFreeCapacity(), store[actOpts.resourceType]);
                    const code = creep.withdraw(store, actOpts.resourceType, amount);
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
                delete creep.memory.act[this.actType];
                return true;
            },
        }
    };

    const _createBuildConstruction: ActCreator = function (actOpts) {
        return {
            actType: ActTypes.BUILD_CONSTRUCTION,
            token: actOpts.constructionSiteId,

            constructionSiteId: actOpts.constructionSiteId,
        
            check(creep: Creep) {
                var ifHaveEnergy = creep.store[RESOURCE_ENERGY] > 0;
                return ifHaveEnergy;
            },
        
            prepare(creep: Creep) {
                creep.memory.act[this.actType] = 0;
                return true;
            },
        
            exec(creep: Creep) {
                const constructionSite = Game.getObjectById(this.constructionSiteId);
                // 初始
                if (creep.memory.act[this.actType] == 0) {
                    creep.say(`🚴‍♀️`);
                    creep.memory.act[this.actType] = 1;
                }
                // 去往constructionSite
                if (creep.memory.act[this.actType] == 1) {
                    if (creep.moveToTarget(constructionSite.pos, 3, actOpts.moveToOpts) == ReturnCode.DONE) {
                        creep.say(`🧱`);
                        creep.memory.act[this.actType] = 2;
                    }
                }
                // build
                if (creep.memory.act[this.actType] == 2) {
                    if (actOpts.times) {
                        var times = creep.memory.act.times === undefined ?
                            actOpts.times : creep.memory.act.times;
                        const energy = creep.store[RESOURCE_ENERGY];
                        if (energy > 0 && times > 0) {
                            creep.build(constructionSite);
                        }
                        // console.log(times);
                        times--;
                        if (energy <= 0 || times <= 0) {
                            creep.say(`🧱✅`);
                            return true;
                        }
                        creep.memory.act.times = times;
                    } else {
                        var energy = creep.store[RESOURCE_ENERGY];
                        if (energy > 0) {
                            creep.upgradeController(creep.room.controller);
                        }
                        if (energy <= 0) {
                            creep.say(`🧱✅`);
                            return true;
                        }
                    }
                    
                    
                }
                return false;
            },
        
            end(creep) {
                delete creep.memory.act[this.actType];
                return true;
            },
    
            break_condition(creep) {
                const constructionSite = Game.getObjectById(this.constructionSiteId);
                const ifSiteExist = (constructionSite !== undefined);
                if (!ifSiteExist) creep.actLog(`construction site does not exist`);
                const ifCreepHaveEnergy = (creep.store[RESOURCE_ENERGY] > 0);
                return ifSiteExist && ifCreepHaveEnergy;
            }
        }
    }
    
    const _actCreatorMenu: Map<ActTypes, ActCreator> = new Map([
        [ActTypes.HARVEST_RESOURCE, _createHarvestResource],
        [ActTypes.STORE_RESOURCE, _createStoreResource],
        [ActTypes.UPGRADE, _createUpgrade],
        [ActTypes.WITHDRAW_RESOURCE, _createWithdrawResource],
        [ActTypes.BUILD_CONSTRUCTION, _createBuildConstruction],
    ])

    const _completeAct = function (this: ActModule, creep: Creep, actType: ActTypes, actOpts: ActOpts): ReturnCode {
        if (!creep.memory.act) {
            this._resetActMemory(creep);
        }
        let act = this._getAct(actType, actOpts);
        // 如果没有act，便指派act
        if (!creep.memory.act.busy) {
            creep.memory.act.actType = actType;
            creep.memory.act.actOpts = actOpts;
            creep.memory.act.token = act.token;
        }
        // 如果在执行当前act，则继续执行，否则返回Busy
        if (
            actType == creep.memory.act.actType &&
            act.token == creep.memory.act.token
        ) {
            return this._runAct(creep);
        } else {
            creep.actLog(`creep is running another act now.`);
            return ReturnCode.BUSY;
        }
    }

    const _runAct = function (this: ActModule, creep: Creep): ReturnCode {
        // 确保每个tick只会执行一个act
        const curTime = Game.time;
        if (creep.memory.act.lastActTime != curTime) {
            creep.memory.act.lastActTime = curTime;
        } else {
            // creep.actLog(`run act more than once at this tick.`);
            return ReturnCode.BUSY;
        }
        let act = this._getAct(creep.memory.act.actType, creep.memory.act.actOpts);
        // check
        if (creep.memory.act.status == 0) {
            if (act.check(creep)) {
                creep.memory.act.busy = true;
                creep.memory.act.status = 1;
            } else {
                creep.actLog(`check failed.`);
                this._resetActMemory(creep);
                return ReturnCode.FAILED; 
            }
        }
        // prepare
        if (creep.memory.act.status == 1) {
            if (act.prepare(creep)) {
                creep.memory.act.status = 2;
            }
        }
        // exec
        if (creep.memory.act.status == 2) {
            if (act.exec(creep)) {
                creep.memory.act.status = 3;
            }
        }
        // check break condition
        if (Boolean(act.break_condition) && [1, 2].includes(creep.memory.act.status)) {
            if (!act.break_condition(creep)) {
                creep.say(`❗⏹`);
                creep.actLog(`act break.`);
                creep.memory.act.status = 3;
            }
        }
        // end
        if (creep.memory.act.status == 3) {
            if (act.end(creep)) {
                this._resetActMemory(creep);
                return ReturnCode.DONE;
            }
        }
        return ReturnCode.PROCESSING;
    }

    const _getAct = function (this: ActModule, actType: ActTypes, actOpts: ActOpts): Act {
        return this._actCreatorMenu.get(actType)(actOpts);
    }

    const _resetActMemory = function (creep: Creep) {
        creep.memory.act = {
            status: 0,
            busy: false
        };
    };


    return {
        work: work,
        harvestResource: harvestResource,
        storeResource: storeResource,
        upgrade: upgrade,
        withdrawResource: withdrawResource,
        buildConstruction: buildConstruction,
        _getAct: _getAct,
        _actCreatorMenu: _actCreatorMenu,
        _runAct: _runAct,
        _resetActMemory: _resetActMemory,
        _completeAct: _completeAct
    }
}




