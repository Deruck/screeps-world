import { createCreepExtensionModule } from "@/module/prototype_extension/creep.extension";

import { ActModule } from "./act.module";

export const creepExtensionModule = createCreepExtensionModule({
    getAct: ActModule.getAct
})