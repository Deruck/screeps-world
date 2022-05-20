export function moveToPos(creep: Creep, target: RoomPosition, preempt_disable: boolean = false): void {
    if (!creep.memory.move || (!creep.memory.preempt_disable && !target.isEqualTo(creep.memory.move.target.x, creep.memory.move.target.y))) {
        // 如果没有指派目标，或是可抢占时被指派了新目标，则查找新的路径
        creep.memory.move = {
            path: PathFinder.search(creep.pos, target).path,
            target: target,
        };
        creep.memory.preempt_disable = preempt_disable;
        console.log(`${creep.name}: finding path to ${JSON.stringify(target)}`);
    } else if (creep.memory.preempt_disable && creep.memory.move.target != target) {
        // 如果不可抢占，但被指派了新任务
        console.log(`${creep.name}: the creep is not preemptable.`);
    }
    if (creep.pos == creep.memory.move.target) {
        creep.say(`Already done.`);
        delete creep.memory.move;
        return;
    }
    creep.moveByPath(creep.memory.move.path);
    console.log(creep.pos, creep.memory.move.path[0], creep.pos.isEqualTo(creep.memory.move.path[0]));
    if (creep.pos.isEqualTo(creep.memory.move.path[0])) {
        creep.say(`Moving...`)
        creep.memory.move.path.shift();
    }
}