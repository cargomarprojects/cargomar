
import { GlobalVariables } from '../../core/models/globalvariables';

export class Taxm {
    tax_pkid: string;
    tax_desc: string;
    tax_acc_id: string;

    tax_acc_code: string;
    tax_acc_name: string;
    tax_sac_code: string;

    tax_from_dt: string;
    tax_to_dt: string;
    tax_cgst_rate: number;
    tax_sgst_rate: number;
    tax_igst_rate: number;

    rec_mode: string;
    _globalvariables: GlobalVariables;

}
     