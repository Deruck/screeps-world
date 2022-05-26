import { createExtensionModule } from "@/module/prototype_extension/extension";
import { createCreepExtensionModule } from "@/module/prototype_extension/extension.creep";
import { createSpawnExtensionModule } from "@/module/prototype_extension/extension.spawn";

const creepExtensionModule = createCreepExtensionModule({

})

const spawnExtensionModule = createSpawnExtensionModule({

})


export const extensionModule = createExtensionModule({
    addCreepExtension: creepExtensionModule.addCreepExtension,
    addSpawnExtension: spawnExtensionModule.addSpawnExtension
})
