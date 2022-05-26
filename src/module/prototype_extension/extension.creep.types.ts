import { ReturnCode, ActTypes } from "@/const";


declare global {
    interface CreepExtension {

        moveToTarget(
            this: Creep,
            targetPos: RoomPosition,
            range: number,
            moveToOpts?: MoveToOpts
        ): ReturnCode;

        actLog(this: Creep, content: string): void;

    }

    interface Creep extends CreepExtension { }

}
