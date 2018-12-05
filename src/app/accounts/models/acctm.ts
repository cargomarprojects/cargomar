
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

    acc_type_id: string;
    acc_type_name: string;

    acc_against_invoice: string;
    acc_cost_centre: boolean;
    acc_taxable: boolean;
    acc_sepz_unit: boolean;

    acc_sac_id: string;
    acc_sac_code: string;

    acc_branch_code : string;
  
    rec_mode: string;

    _globalvariables: GlobalVariables;

}
