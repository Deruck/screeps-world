import { ActTypes } from "@/const";

declare global {
    interface CreepExtensionModuleContext {
        getAct(actType: ActTypes): Act
    }
    
    interface CreepExtensionModule {
        addCreepExtionsion(): void
    }
}

