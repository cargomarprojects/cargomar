import { GlobalVariables } from '../../core/models/globalvariables';

export class Prod {
    sw_pkid: string;
    sw_jobid: string;
    sw_itmid: string;
    sw_year: number;
    sw_serial_no: number;
    sw_prod_batch_id: string;
    sw_prod_batch_qty: number;
    sw_unit_id: string;
    sw_unit_code: string;
    sw_unit_name: string;
    sw_date_manufacture: string;
    sw_date_expiry: string;
    sw_best_before: string;

    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
}

