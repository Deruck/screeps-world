import { createActModule } from "@/module/act/act";

import { worldStateModule } from "./world_state.module";

export const actModule = createActModule({
    worldStateModule: worldStateModule
})
