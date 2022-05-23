import { createExtensionModule } from "@/module/prototype_extension/extension";

import { creepExtensionModule } from "./creep_extension.module";

export const ExtensionModule = createExtensionModule({
    addCreepExtension: creepExtensionModule.addCreepExtionsion
})
