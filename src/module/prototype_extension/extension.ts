export const createExtensionModule = function(ctx: ExtensionModuleContext): ExtensionModule {
    const addPrototypeExtension = function () {
        console.log(`挂载原型拓展...`)
        ctx.addCreepExtension();
        ctx.addSpawnExtension();
    }

    return {
        addPrototypeExtension: addPrototypeExtension
    }
}
