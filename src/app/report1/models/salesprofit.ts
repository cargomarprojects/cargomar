
import { GlobalVariables } from '../../core/models/globalvariables';
import { Yearm } from '../../core/models/yearm';

export class SalesProfitm {
  sa_pkid: string;
  sa_year: string;
  sa_year_name: string;
  sa_qtr: string;
  sa_month: string;
  sa_start_date: string;
  sa_end_date: string;
  sa_remarks: string;
  rec_comapny_code: string;
  rec_created_by: string;
  rec_created_date: string;
  _globalvariables: GlobalVariables;
}

export class SalesProfitd {
  sa_parnet_id: string;
  sa_branch: string;
  sa_category: string;
  sa_type: string;
  sa_shipper: string;
  sa_name: string;
  sa_amount: number;
  sa_interest: number;
}

export class SalesCtc {
  ctc_year: number;
  ctc_qtr: string;
  ctc_branch: string;
  ctc_name: string;
  ctc_amount: number;
  ctc_manager: string;
}



export interface iSalesProfitmModel {
  // filter Values
  selectedRowIndex: number;
  currentTab: string;
  mode: string;
  year_code: string;
  RecordList: SalesProfitm[];
  YearList: Yearm[];

  ErrorMessage: string;

  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iSalesProfitmModel = {
  selectedRowIndex: 0,
  mode: '',
  year_code: '',
  currentTab: 'LIST',
  RecordList: [],
  YearList: [],
  ErrorMessage: '',

  page_count: 0,
  page_current: 0,
  page_rows: 15,
  page_rowcount: 0
}


