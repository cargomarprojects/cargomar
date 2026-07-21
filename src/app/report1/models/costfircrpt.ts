
import { GlobalVariables } from '../../core/models/globalvariables';
export class CostFircRpt {

    row_type: string;
    row_colour: string;
    stm_no: number;
    refno: string;
    vrno: number;
    docno: string;
    docdate: string;
    party: string;
    curr: string;
    inv_forein_amt: number;
    ex_rate: number;
    inv_inr_amt: number;
    swift_refno: string;
    swift_date: string;
    swift_amt: number;
    inv_br_alloc_famt: number;
    inv_oth_br_alloc_famt: number;
    tot_inv_alloc_famt: number;
    bank_charges: number;
    net_inv_alloc_famt: number;
    diff_famt: number;
    finyear_count: number;
    narration: string;
    stm_no_rownum: number;
    remarks: string;

    location: string;
    category: string;
    br_dr_famt: number;
    br_dr_alloc_famt: number;
    othbr_dr_famt: number;
    othbr_dr_alloc_famt: number;
    cr_famt: number;
    cr_alloc_famt: number;
    stm_pkid: string;
    base_curr_amt: number;

    _globalvariables: GlobalVariables;
}
