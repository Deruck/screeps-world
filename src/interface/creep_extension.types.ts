import { ActTypes } from "@/const";

declare global {
    interface CreepExtensionModuleContext {
        getAct(actType: ActTypes, actOpts: ActOpts): Act
    }
    
    interface CreepExtensionModule {
        addCreepExtionsion(): void
    }
}

