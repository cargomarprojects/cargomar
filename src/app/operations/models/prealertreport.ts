import { GlobalVariables } from '../../core/models/globalvariables';

export class PreAlertReport {

  hbl_no: string;
  hbl_agent_name: string;
  hbl_shipper_name: string;
  hbl_consignee_name: string;
  hbl_carrier_name: string;
  hbl_bl_no: string;
  hbl_consignee_add1: string;
  hbl_consignee_add2: string;
  hbl_consignee_add3: string;
  hbl_pkg: string;
  hbl_grwt: string;
  hbl_ntwt: string;
  hbl_chwt: string;
  hbl_notify_name: string;
  hbl_pod: string;
  hbl_pofd: string;
  hbl_commodity: string;
  types: string;
  hawb_no: string;
  

  rec_mode: string;

  _globalvariables: GlobalVariables;
}

export interface iPreAlertReportModel {
  // filter Values
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  list_format: string;
  currentTab: string;
  RecordList: PreAlertReport[];

  ErrorMessage: string;

  //Search Values
  searchcontainer: string;

  // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iPreAlertReportModel = {
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  list_format: '',
  currentTab: '',
  RecordList: [],
  
  ErrorMessage: '',

  searchcontainer: '',

  page_count: 0,
  page_current: 0,
  page_rows: 15,
  page_rowcount: 0
}