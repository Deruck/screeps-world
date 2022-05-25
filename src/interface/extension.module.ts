import { createExtensionModule } from "@/module/prototype_extension/extension";
import { createCreepExtensionModule } from "@/module/prototype_extension/creep.extension";
import { createSpawnExtensionModule } from "@/module/prototype_extension/spawn.extension";

const creepExtensionModule = createCreepExtensionModule({

})

const spawnExtensionModule = createSpawnExtensionModule({

})


export const extensionModule = createExtensionModule({
    addCreepExtension: creepExtensionModule.addCreepExtension,
    addSpawnExtension: spawnExtensionModule.addSpawnExtension
})
