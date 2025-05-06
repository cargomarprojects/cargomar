
import { GlobalVariables } from '../../core/models/globalvariables';
import { SearchTable } from '../../shared/models/searchtable';

export class TravelExpense {
    row_type: string;
    row_colour: string;
    te_pkid: string;
    te_slno: number;
    te_date: string;
    te_emp_id: string;
    te_emp_code: string;
    te_emp_name: string;
    te_grade_id: string;
    te_grade_code: string;
    te_grade_name: string;
    te_travel_from: string;
    te_travel_to: string;
    te_purpose: string;
    te_travel_mode: string;
    te_city_type: string;
    te_own_arrangement: boolean;
    te_lodging_days: number;
    te_lodging_amt: number;
    te_boarding_days: number;
    te_boarding_amt: number;
    te_conv_comp_car_amt: number;
    te_conv_taxi_amt: number;
    te_conv_auto_amt: number;
    te_conv_others_amt: number;
    te_conv_total: number;
    te_misc_amt: number;
    te_total: number;
    te_remarks: string;
    te_travel_rules: string;
    te_date_from: string;
    te_date_to: string;

    te_lodging_amt_aprvd: number;
    te_boarding_amt_aprvd: number;
    te_misc_amt_aprvd: number;
    te_conv_comp_car_amt_aprvd: number;
    te_conv_taxi_amt_aprvd: number;
    te_conv_auto_amt_aprvd: number;
    te_conv_others_amt_aprvd: number;
    te_total_aprvd: number;
    te_travel_with: string;

    te_approved_by: string;
    te_sanctioned_by: string;
    te_rejected_by: string;

    rec_branch_code: string;
    rec_mode: string;
    rec_locked: boolean;

    _globalvariables: GlobalVariables;

}

export class TravelRules {
    tr_grade: string;
    tr_travel_mode: string;
    tr_lodging_metro_amt: string;
    tr_lodging_oth_amt: string;
    tr_boarding_metro_amt: string;
    tr_boarding_oth_amt: string;
    tr_conv_desc: string;
    tr_misc_amt: string;
    tr_own_amt: string;
    tr_slno: number;
}

export interface iTravelExpenseModel {
    // filter Values
    selectedRowIndex: number;
    mode: string;
    pkid: string;
    currentTab: string;
    RecordList: TravelExpense[];
    NoteList: SearchTable[];
    ErrorMessage: string;
    // header search Values
    type: string;
    searchstring: string;
    from_date: string;
    to_date: string;
    // Page Values
    page_count: number;
    page_current: number;
    page_rows: number;
    page_rowcount: number;
};

export const initialState: iTravelExpenseModel = {
    selectedRowIndex: 0,
    mode: '',
    pkid: '',
    currentTab: 'LIST',
    RecordList: [],
    NoteList: [],
    ErrorMessage: '',
    type: '',
    searchstring: '',
    from_date: '',
    to_date: '',
    page_count: 0,
    page_current: 0,
    page_rows: 15,
    page_rowcount: 0
}