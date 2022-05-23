interface ExtensionModuleContext {
    addCreepExtension(): void,
    addSpawnExtension?(): void
}

interface ExtensionModule {
    addPrototypeExtension(): void
}