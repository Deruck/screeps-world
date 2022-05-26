import { createWorldStateModule } from "@/module/world_state/world_state";

import { globalMemoryModule } from "./memory.global.module";

export const worldStateModule = createWorldStateModule({
    globalMemoryModule: globalMemoryModule
})
