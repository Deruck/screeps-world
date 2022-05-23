import { ActTypes } from "@/const";

declare global {
    interface ActModuleContext {

    }
    
    interface ActModule {
        getAct(actType: ActTypes): Act;
    }
}

