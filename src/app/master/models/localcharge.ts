
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
    lc_bl: number;
    lc_acd: number;
    lc_ens: number;

    rec_mode: string;
    _globalvariables: GlobalVariables;
}


