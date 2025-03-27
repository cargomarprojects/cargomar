
import { GlobalVariables } from '../../core/models/globalvariables';

export class TravelExpense {
    row_type: string;
    row_colour: string;
    te_pkid: string;
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
    te_travel_mode_id: string;
    te_travel_mode_code: string;
    te_travel_mode_name: string;
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
    te_remarks: string;

    rec_mode: string;
    _globalvariables: GlobalVariables;

}

export interface iTravelExpenseModel {
    // filter Values
    selectedRowIndex: number;
    mode: string;
    pkid: string;
    currentTab: string;
    RecordList: TravelExpense[];
    ErrorMessage: string;
    // header search Values
    type: string;
    searchstring: string;
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
    ErrorMessage: '',
    type: '',
    searchstring: '',
    page_count: 0,
    page_current: 0,
    page_rows: 15,
    page_rowcount: 0
}