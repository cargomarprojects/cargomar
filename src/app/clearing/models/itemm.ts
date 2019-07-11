import { GlobalVariables } from '../../core/models/globalvariables';

export class Itemm {
    itm_pkid: string;
    itm_job_id: string;
    itm_invoice_id: string;
    itm_invoice_no: string;
    itm_desc: string;
    itm_slno: number;

    itm_scheme_id: string;
    itm_scheme_code: string;
    itm_scheme_name: string;

    itm_ritc_id: string;
    itm_ritc_code: string;
    itm_ritc_name: string;

    itm_unit_id: string;
    itm_unit_code: string;
    itm_unit_name: string;

    itm_qty: number;
    itm_unit_factor: number;
    itm_unit_rate: number;
    itm_amount: number;
    itm_pmv: number;
    itm_pmv_total: number;
    itm_cbm: number;
    itm_grwt: number;
    itm_ntwt: number;
    itm_total_cartons: number;
  
    itm_dbk_code: string;
    itm_dbk_name: string;
    itm_dbk_qty: number;

    itm_dbk_type: string;
    itm_dbk_unit: string;
    itm_dbk_rate: number;
    itm_dbk_valuecap: number;
    itm_rosl_rate: number;
    itm_rosl_valuecap: number;
    itm_rosl_ctl_rate: number;
    itm_rosl_ctl_valuecap: number;

    itm_dbk_caption1: string;
    itm_dbk_caption2: string;


    itm_strrefund_no: string;
    itm_strrefund_name: string;
    itm_strrefund_rate: number;
    itm_cess_code: string;
    itm_cess_qty: number;
    itm_accessory_status: string;
    itm_end_use: string;
    itm_end_use_name: string;
    itm_hawb: string;
    itm_igst_pay_status: string;
    itm_taxable_value: number;
    itm_igst_amt: number;
    itm_igst_rate: number;
    itm_stmt_type: string;
    itm_stmt_code1: boolean;
    itm_stmt_code2: boolean;
    itm_stmt_code3: boolean;

    itm_third_party_id: string;
    itm_third_party_code: string;
    itm_third_party_name: string;

    itm_third_party_br_id: string;
    itm_third_party_br_no: string;
    itm_third_party_br_address: string;

    itm_reward: boolean;
    
    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
}
