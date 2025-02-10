import { GlobalVariables } from '../../core/models/globalvariables';
import { Joborderm } from '../../clearing/models/joborder';

export class CartingOrderm {

    co_pkid: string;
    co_sl_no: number;
    co_date: string;
    co_agent_id: string;
    co_agent_code: string;
    co_agent_name: string;
    co_exp_id: string;
    co_exp_code: string;
    co_exp_name: string;
    co_imp_id: string;
    co_imp_code: string;
    co_imp_name: string;
    co_vessel_id: string;
    co_vessel_code: string;
    co_vessel_name: string;
    co_vessel_no: string;
    co_remarks: string;

    rec_mode: string;
    _globalvariables: GlobalVariables;

    OrderList: Joborderm[] = [];
}


export interface iCartingOrdermModel {

    selectedRowIndex: number;
    mode: string;
    pkid: string;
    currentTab: string;
    searchstring: string;
    ErrorMessage: string;
    InfoMessage: string;
    RecordList: CartingOrderm[];
    page_count: number;
    page_current: number;
    page_rows: number;
    page_rowcount: number;



};

export const initialState: iCartingOrdermModel = {
    selectedRowIndex: 0,
    mode: '',
    pkid: '',
    currentTab: 'LIST',
    searchstring: '',
    ErrorMessage: '',
    InfoMessage: '',
    RecordList: [],
    page_count: 0,
    page_current: 0,
    page_rows: 10,
    page_rowcount: 0
} 