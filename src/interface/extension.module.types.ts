/*****************************************************************************************
 * 
 *****************************************************************************************/
interface ExtensionModuleContext {
    addCreepExtension(): void,
    addSpawnExtension(): void
}

interface ExtensionModule {
    addPrototypeExtension(): void
}

/*****************************************************************************************
 * Creep
 *****************************************************************************************/

interface CreepExtensionModuleContext {

}

interface CreepExtensionModule {
    addCreepExtension(): void
}

/*****************************************************************************************
 * Spawn
 *****************************************************************************************/

interface SpawnExtensionModuleContext {

}

interface SpawnExtensionModule {
    addSpawnExtension(): void
}

