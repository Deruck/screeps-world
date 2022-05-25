import { createTaskModule } from "@/module/task/task"

import { actModule } from "./act.module"

export const taskModule = createTaskModule({
    actModule: actModule,
})
