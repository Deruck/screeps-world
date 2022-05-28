import { ReturnCode } from "@/const";

declare global {
    interface Role {
        roleName: string,
        roleInfo: string,
        creepNum: number,
        creepType: CreepType,
        color: string,
        runRole(creep: Creep): void,
    }

    interface CreepMemory {
        role?: {
            roleName?: string,
            status?: number
        }
        
        
    }
}

