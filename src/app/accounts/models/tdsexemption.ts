
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

    rec_mode: string;
    _globalvariables: GlobalVariables;

}

export interface iPage {
    action: string;
    page_count: number;
    page_current: number;
    page_rows: number;
    page_rowcount: number;
}

export interface iTdsExemptionSearch {
    searchstring: string;
}

export interface iTdsExemptionModel {
    selected_row_id: number;
    records: TdsExemption[],
    errorMessage: string,
    searchQuery: iTdsExemptionSearch,
    pageQuery: iPage
};


export const initialState: iTdsExemptionModel = {
    selected_row_id: -1,
    records: [],
    searchQuery: <iTdsExemptionSearch>{ searchstring: '' },
    pageQuery: <iPage>{ action: '', page_count: 0, page_current: 0, page_rows: 0, page_rowcount: 0 },
    errorMessage: ''
  }