interface creepExtension {
    /**
     * creep移动到目标的给定范围内，移动完成后返回TASK_DONE，由外部调用决定是否停止继续移动
     * @param targetPos 
     * @param range 移动到目标范围，0为移动到目标上 
     */
    moveToTarget(
        this: Creep,
        targetPos: RoomPosition,
        range: number,
        moveToOpts?: MoveToOpts
    ): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND | TASK_DONE;
    
    /**
     * 收获资源并存储到指定贮藏点
     * todo: 加入功能-丢弃当前非目标资源
     * @param this 
     * @param from 
     * @param to 
     * @param moveToOpts 
     */
    hearvestToStore(
        this: Creep,
        from: Source,
        to: AnyStructure,
        moveToOpts?: MoveToOpts
    ): number;
}

interface Creep {
    moveToTarget(
        this: Creep,
        targetPos: RoomPosition,
        range: number,
        moveToOpts?: MoveToOpts
    ): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND | TASK_DONE;

    hearvestToStore(
        this: Creep,
        from: Source,
        to: AnyStructure,
        moveToOpts?: MoveToOpts
    ): number;
}

interface CreepMemory {
    /**
     * 0: 去往source的路上
     * 1: hearvest中
     * 2: 回程
     * 3: 储存中
     */
    hearvestToStore?: 0 | 1 | 2 | 3,
}


