import { GlobalVariables } from '../../core/models/globalvariables';

export class LandingCertificateReport {

  hbl_pkid: string;
  hbl_no: string;
  hbl_imp_name: string;
  hbl_bl_no: string;
  hbl_fcr_no: string;
  hbl_date: string;
  hbl_book_cntr: string;
  mbl_pol_etd: string;
  mbl_pol_name: string;
  hbl_no_checked: boolean;

  rec_mode: string;
  _globalvariables: GlobalVariables;
}

export interface iLandingCertificateReportModel {
  // filter Values
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  list_format: string;
  currentTab: string;
  RecordList: LandingCertificateReport[];

  ErrorMessage: string;

  //Search Values
  from_date: string;
  to_date: string;
  search_shprid: string;
  search_shprname: string;

  // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iLandingCertificateReportModel = {
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  list_format: '',
  currentTab: '',
  RecordList: [],
  
  ErrorMessage: '',

  from_date: '',
  to_date: '',
  search_shprid: '',
  search_shprname: '',

  page_count: 0,
  page_current: 0,
  page_rows: 15,
  page_rowcount: 0
}
