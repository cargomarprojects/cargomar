
import { GlobalVariables } from '../../core/models/globalvariables';

export class LlmDoc {

    ld_pkid: string;
    ld_slno: string;
    ld_remarks: string;

    rec_mode: string;
    rec_branch_code: string;
    _globalvariables: GlobalVariables;

}

export interface iLlmDocModel {
    // filter Values
    selectedRowIndex: number;
    mode: string;
    pkid: string;
    currentTab: string;
    RecordList: LlmDoc[];
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

export const initialState: iLlmDocModel = {
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