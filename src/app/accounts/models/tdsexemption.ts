
import { GlobalVariables } from '../../core/models/globalvariables';

export class TdsExemption {

    row_type: string;
    row_colour: string;

    te_pkid: string;
    te_cert_no: string;
    te_cert_date: string;
    te_cust_id: string;
    te_cust_code: string;
    te_cust_name: string;
    te_cust_pan: string;
    te_valid_from: string;
    te_valid_to: string;
    te_year: number;
    te_tds_acc_id: string;
    te_tds_acc_code: string;
    te_tds_acc_name: string;
    te_tds_rate: number;
    te_tds_cert_rate: number;
    te_cr_limit: number;
    te_used_amt: number;
    te_bal_amt: number;
    te_updated_date: string;
    te_doc_count: number;
    te_remarks: string;
    te_pan_id: string;
    te_pan_code: string;
    te_pan_name: string;
    te_taxable_amt: number;
    te_other_amt: number;

    te_jvh_docno: string;
    te_jvh_date: string;
    te_tds: number;
    te_paid_amt: number;

    rec_mode: string;
    rec_branch_code: string;
    _globalvariables: GlobalVariables;

}

export interface iTdsExemptionModel {
    // filter Values
    selectedRowIndex: number;
    mode: string;
    pkid: string;
    currentTab: string;
    RecordList: TdsExemption[];
    ErrorMessage: string;
    // header search Values
    type: string;
    searchstring: string;
    // Page Values
    certno: string;
    totAmt: number;
    pan_id: string;
    tds_acc_id: string;
    page_count: number;
    page_current: number;
    page_rows: number;
    page_rowcount: number;
};

export const initialState: iTdsExemptionModel = {
    selectedRowIndex: 0,
    mode: '',
    pkid: '',
    currentTab: 'LIST',
    RecordList: [],
    ErrorMessage: '',
    type: '',
    searchstring: '',
    certno: '',
    totAmt: 0,
    pan_id: '',
    tds_acc_id: '',
    page_count: 0,
    page_current: 0,
    page_rows: 15,
    page_rowcount: 0
}