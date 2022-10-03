
import { GlobalVariables } from '../../core/models/globalvariables';

export class Acctm {
    acc_pkid: string;
    acc_code: string;
    acc_name: string;

    acc_main_id: string;
    acc_main_code: string;
    acc_main_name: string;

    acc_group_id: string;
    acc_group_name: string;
    acc_main_group_name: string;

    acc_type_id: string;
    acc_type_name: string;

    acc_against_invoice: string;
    acc_cost_centre: boolean;
    acc_taxable: boolean;
    acc_sepz_unit: boolean;

    acc_rcm: boolean;

    acc_sac_id: string;
    acc_sac_code: string;

    acc_branch_code: string;

    acc_bs_id: string;
    acc_bs_code: string;
    acc_bs_name: string;
    acc_bs_note_no: string;
    acc_bs_main_head: string;
    acc_bs_sub_head: string;
    acc_bs_sub_note: string;
    acc_drcr_only: string;
    rec_locked: boolean = false;
    
    rec_mode: string;

    _globalvariables: GlobalVariables;

}
