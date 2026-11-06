
import { GlobalVariables } from '../../core/models/globalvariables';

export class Teu {

  cntr_pkid: string;
  cntr_no: string;
  cntr_teu: number;
  cntr_csealno: string;
  cntr_asealno: string;
  cntr_type_code: string;
  cntr_booking_no: string;
  cntr_stuffed_at: string;
  cntr_stuffed_on: string;
  cntr_pcs: number;
  cntr_ntwt: number;
  cntr_grwt: number;
  cntr_cbm: number;
  cntr_clearing: string;

  mbl_no: string;
  mbl_book_no: string;
  mbl_pol_etd: string;
  mbl_shipment_type: string;
  mbl_nature: string;
  hbl_exp_name: string;
  hbl_imp_name: string;

  hbl_agent_name: string;
  hbl_carrier_name: string;
  hbl_pol_name: string;
  hbl_pod_name: string;
  hbl_pofd_name: string;
  branch: string;
  hbl_nomination: string;
  mbl_pod_eta: string;
  job_billto_name: string;
  hbl_notify_name: string;

  JAN: string;
  FEB: string;
  MAR: string;
  APR: string;
  MAY: string;
  JUN: string;
  JUL: string;
  AUG: string;
  SEP: string;
  OCT: string;
  NOV: string;
  DEC: string;

  TableDataList: TblColumns[] = [];

  _globalvariables: GlobalVariables;
}

export class TblColumns {
  col_header_name: string;
  col_field_name: string;
  col_class_style: string;
  col_field_value: number;
}

export interface iTeuReportModel {
  // filter Values
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  list_format: string;
  currentTab: string;
  RecordList: Teu[];

  ColNames: any[];
  YearList: any[];
  HeaderList: TblColumns[];

  ErrorMessage: string;

  type_date: string;
  from_date: string;
  to_date: string;
  year_code: string;
  shipper_id: string;
  shipper_name: string;
  consignee_id: string;
  consignee_name: string;
  agent_id: string;
  agent_code: string;
  agent_name: string;
  carrier_id: string;
  carrier_name: string;
  pol_id: string;
  pol_name: string;
  pod_id: string;
  pod_name: string;
  branch_code: string;
  branch_name: string;
  report_format: string;
  all: boolean;
  isSubtot: boolean;

  // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iTeuReportModel = {
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  list_format: '',
  currentTab: '',
  RecordList: [],
  ColNames: [],
  YearList: [],
  HeaderList: [],
  ErrorMessage: '',
  type_date: '',
  from_date: '',
  to_date: '',
  year_code: '',
  shipper_id: '',
  shipper_name: '',
  consignee_id: '',
  consignee_name: '',
  agent_id: '',
  agent_code: '',
  agent_name: '',
  carrier_id: '',
  carrier_name: '',
  pol_id: '',
  pol_name: '',
  pod_id: '',
  pod_name: '',
  branch_code: '',
  branch_name: '',
  report_format: '',
  all: false,
  isSubtot: false,

  page_count: 0,
  page_current: 0,
  page_rows: 15,
  page_rowcount: 0
}


