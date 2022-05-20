import { RETURN_CODE } from "@/const/const";

export function addCreepExtension() {
    _.assign(Creep.prototype, creepExtension);
}


const creepExtension: creepExtension = {
    moveToTarget(targetPos, range, moveToOpts = undefined) {
        if (this.pos.inRangeTo(targetPos, range)) {
            return RETURN_CODE.TASK_DONE;
        } else {
            return this.moveTo(targetPos, moveToOpts);
        }
    },

    hearvestToStore(from, to, moveToOpts?) {
        if (!this.memory.hearvestToStore) {
            this.memory.hearvestToStore = 0;
        }
        if (this.memory.hearvestToStore == 0) { 
            if (this.store.getFreeCapacity() <= 0) {
                this.memory.hearvestToStore = 2;
            } else {
                this.say(`🚴‍♀️➡`);
                if (this.moveToTarget(from.pos, 1, moveToOpts) == RETURN_CODE.TASK_DONE) {
                    this.say(`🚴‍♀️✅`);
                    this.memory.hearvestToStore = 1;
                }   
            }
        }
        if (this.memory.hearvestToStore == 1) {
            var cap = this.store.getFreeCapacity();
            if (cap > 0) {
                this.say(`⛏: ${cap}`);
                this.harvest(from);
            } else {
                this.say(`⛏✅`);
                this.memory.hearvestToStore = 2;
            }
        }
        if (this.memory.hearvestToStore == 2) {
            this.say(`🚴‍♀️⬅`);
            if (this.moveToTarget(to.pos, 1, moveToOpts) == RETURN_CODE.TASK_DONE) {
                this.say(`🚴‍♀️✅`);
                this.memory.hearvestToStore = 3;
            }   
        }
        if (this.memory.hearvestToStore == 3) {
            this.say(`🔄...`);
            var code = this.transfer(to, RESOURCE_ENERGY);
            if ([-6, -8, 0].includes(code)) {
                this.say(`🔄✅: ${code}`);
                delete this.memory.hearvestToStore;
                return RETURN_CODE.TASK_DONE;
            } else {
                this.say(`🔄❌: ${code}`);
                delete this.memory.hearvestToStore;
                return RETURN_CODE.TASK_DONE;
            }
        }

        return RETURN_CODE.TASK_PROCESSING;
    },
}