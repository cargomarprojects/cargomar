
import { GlobalVariables } from '../../core/models/globalvariables';

export class Acgroupm {
    acgrp_pkid: string;
    acgrp_name: string;
    acgrp_parent_id: string;
    acgrp_parent_name: string;
    acgrp_drcr: string;
    acgrp_level: number;
    acgrp_order: number;
    acgrp_fixedasset_code: string;
    acgrp_bs_id: string;
    acgrp_bs_code: string;
    acgrp_bs_name: string;
    acgrp_acc_update: boolean;
    
    rec_mode: string;
    _globalvariables: GlobalVariables;
}
