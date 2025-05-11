import { registerToGlobal } from "./global";

export function getClassName(obj: Object): string {
    return obj.constructor.name;
}

export function registerClass<T extends Object>(cls: Constructor<T>): void {
    registerToGlobal(cls, cls.name);
}

export function getClassByName<T extends Object>(name: string): Constructor<T> {
    const res = (global as any)[name];
    if (res === undefined) {
        throw Error(`Register class ${name} by registerClass(${name}) first.`);
    }
    if (typeof res !== "function") {
        throw Error(`${name} is not a class.`)
    }
    return res;
}
