import { CreepTypeNames } from "@/const"
declare global {
    interface TaskController {

    }
    
    /**等待发布的任务队列，每个队列只针对一种creep资源*/
    interface TaskQue {
        /**目标creep类型 */
        creepType: CreepTypeNames,
        /**
         * 加入新任务对象，解析后放入memory
         */
        push(task);
        /**
         * 弹出队首任务，并解析
         */
        pop(task);
    }
}

