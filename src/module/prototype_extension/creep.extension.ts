import { ActTypes, ReturnCode } from "@/const";

const defaultMoveToOpts: MoveToOpts = {
    reusePath: 5, 
    visualizePathStyle: {
        stroke: "#ffffff",
    }
}

export const createCreepExtensionModule = function (context: CreepExtensionModuleContext): CreepExtensionModule {
    const getAct = context.getAct;

    /*******************************************************************************************
     * 
     *******************************************************************************************/
    const creepExtension: CreepExtension = {

        /*****************************************************************************************
         * Basics
         *****************************************************************************************/

        moveToTarget(targetPos, range, moveToOpts) {
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

        /*****************************************************************************************
         * Acts
         *****************************************************************************************/
    
        runAct(actType, actOpts) {
            const act = getAct(actType, actOpts);
            if (!this.memory.act) {
                this._resetActMemory();
            }
            if (this.memory.act.busy.status && !(this.memory.act.busy[actType])) {
                return ReturnCode.FAILED;
            }
            if (this.memory.act.status == 0) {
                if (act.check(this)) {
                    this.memory.act.status = 1;
                } else {
                    return ReturnCode.FAILED;
                }
            } 
            if (Boolean(act.break_condition) && [1, 2].includes(this.memory.act.status)) {
                if (act.break_condition(this)) {
                    this.say(`❗⏹`);
                    if (act.end(this)) {
                        this._resetActMemory();
                        return ReturnCode.FAILED;
                    }
                }
            }
            if (this.memory.act.status == 1) {
                // this.say(`🕐`);
                if (act.prepare(this)) {
                    this.say(`▶`)
                    this.memory.act.busy[actType] = true;
                    this.memory.act.busy.status = true;
                    this.memory.act.status = 2;
                }
            }
            if (this.memory.act.status == 2) {
                if (act.exec(this)) {
                    // this.say(`🔚`);
                    this.memory.act.status = 3;
                }
            }
            if (this.memory.act.status == 3) {
                if (act.end(this)) {
                    this._resetActMemory();
                    return ReturnCode.DONE;
                }
            }
            return ReturnCode.PROCESSING;
        },
    
        _resetActMemory() {
            this.memory.act = {
                status: 0,
                busy: {
                    status: false
                }
            };
        },

        harvestEnergy(source: Source, moveToOpts: MoveToOpts = defaultMoveToOpts): ReturnCode {
            return this.runAct(ActTypes.HARVEST_ENERGY, {
                source: source,
                moveToOpts: moveToOpts
            })
        },

        storeResource(store: AnyStoreStructure, resourceType: ResourceConstant, amount?: number, moveToOpts: MoveToOpts = defaultMoveToOpts): ReturnCode {
            var actOpts: ActOpts = {
                store: store,
                resourceType: resourceType,
                moveToOpts: moveToOpts
            }
            if (amount) {
                actOpts.amount = amount;
            }
            return this.runAct(ActTypes.STORE_RESOURCE, actOpts);
        },

        upgrade(upgradeTimes?: number, moveToOpts: MoveToOpts = defaultMoveToOpts): ReturnCode {
            return this.runAct(ActTypes.UPGRADE, {
                moveToOpts: moveToOpts,
                upgradeTimes: upgradeTimes
            })
        },

        /*****************************************************************************************
         * Tasks
         *****************************************************************************************/
    
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