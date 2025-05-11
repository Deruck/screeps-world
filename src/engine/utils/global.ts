export function registerToGlobal(obj: any, name: string) {
    (<any>global)[name]= obj;
}

export function getFromGlobal(name: string) {
    return (<any>global)[name];
}
