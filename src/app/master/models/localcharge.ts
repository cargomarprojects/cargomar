
import { GlobalVariables } from '../../core/models/globalvariables';

export class LocalCharge {
    lc_pkid: string;
    lc_pol_id: string;
    lc_pol_name: string;
    lc_pol_code: string;
    lc_carrier_id: string;
    lc_carrier_code: string;
    lc_carrier_name: string;
    lc_valid_from: string;
    lc_valid_to: string;
    lc_dry_20_thc: number;
    lc_dry_40_thc: number;
    lc_reefer_20_thc: number;
    lc_reefer_40_thc: number;
    lc_muc: number;
    lc_seal: number;
    lc_seal_curr: string;
    lc_bl: number;
    lc_acd: number;
    lc_ens: number;
    lc_oth: number;
    lc_oth_curr: string;

    rec_created_date:string;    
    rec_created_by:string;    
    rec_mode: string;
    rec_branch_code:string;
    _globalvariables: GlobalVariables;
}


