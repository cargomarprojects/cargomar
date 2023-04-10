
import { GlobalVariables } from '../../core/models/globalvariables';

export class ShipmentReport {
    job_docno: string;
    job_date: string;
    job_exp_name: string;
    job_imp_name: string;
    jexp_invoice_no: string;
    jexp_invoice_date: string;
    jexp_curr_code: string;
    jexp_exrate: number;
    jexp_contract_nature: string;
    jexp_inv_amt: number;
    opr_sbill_no: string;
    opr_sbill_date: string;
    _globalvariables: GlobalVariables;
}
