import { RETURN_CODE } from "@/const/const";

export function addCreepExtension() {
    _.assign(Creep.prototype, creepExtension);
}


const creepExtension: creepExtension = {
    moveToTarget(targetPos, range, moveToOpts = undefined) {
        if (this.pos.inRangeTo(targetPos, range)) {
            return RETURN_CODE.TASK_DONE;
        } else {
            var code = this.moveTo(targetPos, moveToOpts);
            if (code == -5 || code == -2) {
                this.say(`🔎❌`);
            } else if (code == -11) {
                this.say(`🛌`);
            }
            return this.moveTo(targetPos, moveToOpts);
        }
    },

    harvestToStore(from, to, moveToOpts?) {
        if (this.memory.harvestToStore === undefined) {
            if (!this.memory.busy) {
                this.say(`🆕: ⛏🛢`);
                this.memory.harvestToStore = 0;
                this.memory.busy = true;
            } else {
                return RETURN_CODE.CREEP_BUSY;
            }
        }
        var cap = this.store.getCapacity();
        if (this.memory.harvestToStore == 0) { 
            if (this.store.getFreeCapacity() <= this.store.getUsedCapacity()) {
                this.say(`🚴‍♀️⬅`);
                this.memory.harvestToStore = 2;
            } else {
                // this.say(`🚴‍♀️➡`);
                if (this.moveToTarget(from.pos, 1, moveToOpts) == RETURN_CODE.TASK_DONE) {
                    // this.say(`🚴‍♀️✅`);
                    this.say(`⛏...`);
                    this.memory.harvestToStore = 1;
                }   
            }
        }
        if (this.memory.harvestToStore == 1) {
            var freeCap = this.store.getFreeCapacity();
            if (freeCap > 0) {
                // this.say(`⛏: ${cap - freeCap}/${cap}`);
                this.harvest(from);
            } else {
                // this.say(`⛏✅`);
                this.say(`🚴‍♀️⬅`);
                this.memory.harvestToStore = 2;
            }
        }
        if (this.memory.harvestToStore == 2) {
            if (this.moveToTarget(to.pos, 1, moveToOpts) == RETURN_CODE.TASK_DONE) {
                // this.say(`🚴‍♀️✅`);
                this.say(`🔄...`);
                this.memory.harvestToStore = 3;
            }   
        }
        if (this.memory.harvestToStore == 3) {
            var code = this.transfer(to, RESOURCE_ENERGY);
            if ([-6, -8, 0].includes(code)) {
                this.say(`🔄✅: ${code}`); 
            } else {
                this.say(`🔄❌: ${code}`);
            }
            delete this.memory.harvestToStore;
            delete this.memory.busy;
            return RETURN_CODE.TASK_DONE;
        }
        return RETURN_CODE.TASK_PROCESSING;
    },

    harvestToUpgrade(this, from, moveToOpts?) {
        if (this.memory.harvestToUpgrade === undefined) {
            if (!this.memory.busy) {
                this.say(`🆕: ⛏🆙`);
                this.say(`🚴‍♀️➡`);
                this.memory.harvestToUpgrade = 0;
                this.memory.busy = true;
            } else {
                return RETURN_CODE.CREEP_BUSY;
            }
        }
        var cap = this.store.getCapacity();
        if (this.memory.harvestToUpgrade == 0) { 
            if (this.store.getFreeCapacity() <= this.store.getUsedCapacity()) {
                this.memory.harvestToUpgrade = 2;
            } else {
                // this.say(`🚴‍♀️➡`);
                if (this.moveToTarget(from.pos, 1, moveToOpts) == RETURN_CODE.TASK_DONE) {
                    // this.say(`🚴‍♀️✅`);
                    this.say(`⛏...`);
                    this.memory.harvestToUpgrade = 1;
                }   
            }
        }
        if (this.memory.harvestToUpgrade == 1) {
            var freeCap = this.store.getFreeCapacity();
            if (freeCap > 0) {
                // this.say(`⛏: ${cap - freeCap}/${cap}`);
                this.harvest(from);
            } else {
                // this.say(`⛏✅`);
                this.say(`🚴‍♀️⬅`);
                this.memory.harvestToUpgrade = 2;
            }
        }
        if (this.memory.harvestToUpgrade == 2) {
            // this.say(`🚴‍♀️⬅`);
            if (this.moveToTarget(this.room.controller.pos, 3, moveToOpts) == RETURN_CODE.TASK_DONE) {
                // this.say(`🚴‍♀️✅`);
                this.say(`🆙...`);
                this.memory.harvestToUpgrade = 3;
            }   
        }
        if (this.memory.harvestToUpgrade == 3) {
            var energy = this.store[RESOURCE_ENERGY];
            if (energy > 0) {
                var code = this.upgradeController(this.room.controller);
                if (code == 0) {
                    // this.say(`🆙: ${energy}/${cap}`);
                } else {
                    // this.say(`🆙❌: ${code}`);
                }
                
            } else {
                // this.say(`🆙✅: ${code}`);
                delete this.memory.harvestToUpgrade;
                delete this.memory.busy;
                return RETURN_CODE.TASK_DONE;
            }
        }
        return RETURN_CODE.TASK_PROCESSING;
    }, 
}