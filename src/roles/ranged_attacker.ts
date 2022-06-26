import { creepTypeModule } from "@/interface/creep_type.module";
import { Color, CreepTypeNames } from "@/const";
import { actModule } from "@/interface/act.module";
import { worldStateModule } from "@/interface/world_state.module";



const rangedAttacker = creepTypeModule.getCreepType(
    CreepTypeNames.RANGED_ATTACKER,
    {
        ranged_attack: 14, 
        move: 7
    }
)

export const ranged_attacker0: Role = {
    roleName: "ranged_attacker0",
    roleInfo: "ranged_attacker0",
    creepType: rangedAttacker,
    creepNum: 1, 
    color: Color.ATTACK,
    runRole(creep) {
        if (creep.moveToTarget(new RoomPosition(45, 13, "W51S27"), 0)) {
            // @ts-ignore
            var hostileCreep: Creep = Game.getObjectById("62b7d9c92248f11f702afe55");
            creep.rangedAttack(hostileCreep);
        }

    }
}

