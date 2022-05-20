// Memory.oneTimeExec = false;

export const loop = function () {
    if (!Memory.oneTimeExec) {
        console.log(1);
        Memory.oneTimeExec = true;
    }
}