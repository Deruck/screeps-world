import { getFromGlobal } from "./utils/global";
import { logger } from "./utils/logger";
import { Singleton } from "./utils/singleton";

declare global {
    interface HasMemory<MemoryType> {
        constructor: ConstructorWithMemory<HasMemory<MemoryType>>;
    }

    type ClassName = string;
    type MemDest = string;
    type MemoryType<T> =  T extends HasMemory<infer M> ? M : never;
    type ConstructorWithMemory<T extends HasMemory<any>> = new (memory: MemoryType<T>) => T;
}

declare global {
    interface Memory {
        memoryManager: {
            classMap: { [dest: MemDest]: ClassName }
        };
    }
}

class MemoryManager extends Singleton {

    load<T extends HasMemory<any>>(dest: MemDest): T | null {
        const className = this.classMap[dest];
        if (!className) {
            logger.error(`Dest "${dest}" has no class name.`)
            return null;
        }
        var obj: T;
        try {
            obj = new (getFromGlobal(className) as Constructor<T>)();
        } catch {
            logger.error(`Class ${className} is not registered.`);
            return null;
        }
        obj.memory = this.getObjByDest(dest) as Object;
        return obj as T;
    }

    dump<T extends HasMemory<any>>(obj: T, dest: MemDest) {
        this.classMap[dest] = obj.constructor.name;
        eval(`${this.getFullDest(dest)} = obj.memory;`);
    }

    delete(dest: MemDest) {
        try {
            eval(`delete ${this.getFullDest(dest)};`);
        } catch { }
        delete this.classMap[dest];
    }

    move(source: MemDest, target: MemDest) {
        const obj = this.getObjByDest(source);
        this.delete(source);
        if (obj === undefined) {
            return;
        }
        eval(`${this.getFullDest(target)} = obj;`);
        this.classMap[target] = this.classMap[source];
        delete this.classMap[source];
    }

    // Singleton Interface
    static getInstance(): MemoryManager {
        return super.getInstance.call(this) as MemoryManager;
    }

    private get memory() {
        return Memory.memoryManager;
    }

    private get classMap() {
        return this.memory.classMap;
    }

    private constructor() {
        super()
        if (!Memory.memoryManager) {
            Memory.memoryManager = {
                classMap: { }
            }
        }
        if (!this.memory.classMap) {
            this.memory.classMap = { };
        }
    }

    private getObjByDest(dest: MemDest): Object | undefined {
        return eval(`${this.getFullDest(dest)}`);
    }

    private getFullDest(dest: MemDest): string {
        return `Memory.${dest}`;
    }
}

export const memoryManager = MemoryManager.getInstance();
