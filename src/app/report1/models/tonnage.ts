
import { GlobalVariables } from '../../core/models/globalvariables';

export class Tonnage {

  mbl_pkid: string;
  mbl_date: string;
  mbl_no: string;
  mbl_grwt: number;
  mbl_chwt: number;
  hbl_grwt: number;
  hbl_chwt: number;
  hbl_shipper_name: string;
  hbl_consignee_name: string;
  hbl_nomination: string;
  mbl_agent_name: string;
  mbl_airline_name: string;
  hbl_pod_name: string;
  hbl_pofd_name: string;
  mbl_status_name: string;
  mbl_pod_eta: string;
  hbl_billto_name: string;
  hbl_notify_name: string;

  hbl_pol_name: string;
  branch: string;
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



export interface iTonnageModel {
  // filter Values
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  list_format: string;
  currentTab: string;
  RecordList: Tonnage[];

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

  // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iTonnageModel = {
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  list_format: 'GENERAL',
  currentTab: 'LIST',
  RecordList: [],
  ColNames: [],
  YearList: [],
  HeaderList: [],
  ErrorMessage: '',
  type_date: 'MAWB DATE',
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
  report_format: 'GENERAL',
  all: false,

  page_count: 0,
  page_current: 0,
  page_rows: 15,
  page_rowcount: 0
}

