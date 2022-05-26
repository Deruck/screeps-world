import { ReturnCode } from "@/const";

declare global {
    interface Role {
        roleName: string,
        creepNum: number,
        creepType: CreepType,
        runRole(creep: Creep): void,
    }

    interface CreepMemory {
        role?: {
            roleName?: string,
            status?: number
        }
        
        
    }
}

