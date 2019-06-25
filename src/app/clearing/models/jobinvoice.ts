import { GlobalVariables } from '../../core/models/globalvariables';

export class JobInvoicem {
    jexp_pkid: string;
    jexp_job_id: string;
    jexp_invoice_no: string;
    jexp_invoice_date: string;
    jexp_curr_id: string;
    jexp_curr_code: string;
    jexp_exrate: number;
    jexp_lcno: string;
    jexp_payment_type: string;
    jexp_valid_period: number;
    jexp_contract_no: string;
    jexp_comm_invoice_no: string;
    jexp_contract_nature: string;
    jexp_freight_amount: number;
    jexp_freight_curr_id: string;
    jexp_freight_curr_code: string;
    jexp_insurance_rate: number;
    jexp_insurance_amount: number;
    jexp_insurance_curr_id: string;
    jexp_insurance_curr_code: string;
    jexp_packing_amount: number;
    jexp_packing_curr_id: string;
    jexp_packing_curr_code: string;
    jexp_commission_rate: number;
    jexp_commission_amount: number;
    jexp_commission_curr_id: string;
    jexp_commission_curr_code: string;
    jexp_fobdiscount_rate: number;
    jexp_fobdiscount_amount: number;
    jexp_fobdiscount_curr_id: string;
    jexp_fobdiscount_curr_code: string;
    jexp_otherded_rate: number;
    jexp_otherded_amount: number;
    jexp_otherded_curr_id: string;
    jexp_otherded_curr_code: string;
    jexp_add: string;
    jexp_inv_amt: number;

    jexp_isconsbuyersame: boolean;
    jexp_buyer_id: string
    jexp_buyer_code: string
    jexp_buyer_name: string
    jexp_buyer_br_id: string
    jexp_buyer_br_no: string
    jexp_buyer_address: string;

    jexp_tp_code: string;
    jexp_tp_name: string;
    jexp_tp_addr1: string;
    jexp_tp_addr2: string;
    jexp_tp_city: string;
    jexp_tp_country_subdiv: string;
    jexp_tp_country_id: string
    //jexp_tp_country_code: string
    jexp_tp_country_name: string
    jexp_tp_pin: string;

    jexp_aeo_operator_code: string;
    jexp_aeo_operator_country_id: string
    //jexp_aeo_operator_country_code: string
    jexp_aeo_operator_country_name: string
    jexp_aeo_operator_role: string;
    jexp_aeo_term_place: string;
    jexp_show_amount: Boolean;

    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
}

