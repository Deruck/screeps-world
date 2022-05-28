import { carrierLeft, carrierRight } from "./roles/carrier";
import { harvester0, harvester1 } from "./roles/harvester";
import { transferer0 } from "./roles/transferer";
import { upgrader0, worker0, worker1 } from "./roles/worker";




export const configs = {
    roleList: [
        transferer0,
        harvester0,
        carrierLeft, 
        harvester1,
        carrierRight,
        upgrader0,
        worker0,
        worker1,
    ]
}