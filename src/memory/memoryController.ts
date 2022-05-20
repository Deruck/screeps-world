export class MemoryController {
    static removeDeadCreepMemory(): void {
        var delete_list = [];
        for (var creep in Memory.creeps) {
            if (!Game.creeps[creep]) {
                delete Memory.creeps[creep];
                delete_list.push(creep);
            }
        }
        console.log(`Delete memory of creeps: ${delete_list}`);
    }
}