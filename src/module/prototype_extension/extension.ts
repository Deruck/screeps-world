export const createExtensionModule = function(context: ExtensionModuleContext): ExtensionModule {
    const addCreepExtension = context.addCreepExtension;

    const addPrototypeExtension = function () {
        console.log(`挂载原型拓展...`)
        addCreepExtension();
    }

    return {
        addPrototypeExtension: addPrototypeExtension
    }
}
