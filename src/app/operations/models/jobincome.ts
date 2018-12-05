import { GlobalVariables } from '../../core/models/globalvariables';


export class JobIncome {


    inv_pkid: string;
    inv_year: number;
    inv_parent_id: string;


    inv_source: string;
    inv_category: string;
    inv_type: string;
    inv_calcon: string;

    inv_cntr_type_id: string;
    inv_cntr_type: string;

    inv_acc_id: string;
    inv_acc_main_code: string;
    inv_acc_code: string;
    inv_acc_name: string;
    inv_drcr: string;


    inv_qty: number;
    inv_rate: number;
    inv_ftotal: number;
    inv_rebate_amt: number;

    inv_curr_id: string;
    inv_curr_code: string;

    inv_exrate: number;
    inv_total: number;

    inv_remarks: string;

    inv_ctr: number;

    inv_rebate_curr_code: string;
    inv_rebate_exrate: number;
    inv_rebate_amt_inr: number;

    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
}

