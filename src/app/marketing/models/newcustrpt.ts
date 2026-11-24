
import { GlobalVariables } from '../../core/models/globalvariables';
export class NewCustReport {
    sman_name: string;
    cust_name: string;
    cons_name: string;
    both_nos: number;
    clr_nos: number;
    fwd_nos: number;
    rec_category: string;
    first_job_date: string;
    last_job_date: string;
    previous_job_date: string;
    cust_created_date: string;
    cust_created_branch: string;
    pod: string;
    teu: number;
    cbm: number;
    cust_nomination: string;
    row_type: string;
    // cust_type: string;
    _globalvariables: GlobalVariables;
}

export interface iNewCustReportModel {
  // filter Values
  Initialized: boolean;
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  list_format: string;
  currentTab: string;
  RecordList: NewCustReport[];

  InfoMessage: string;
  ErrorMessage: string;

  fromdate: string;
  searchType: string;
  searchstring: string;
  Is_Nomination: boolean;

  // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iNewCustReportModel = {
  Initialized: false,
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  list_format: '',
  currentTab: 'LIST',
  RecordList: [],

  InfoMessage: '',
  ErrorMessage: '',

  fromdate: '',
  searchType: '',
  searchstring: '',
  Is_Nomination: false,

  page_count: 0,
  page_current: 0,
  page_rows: 20,
  page_rowcount: 0
}
