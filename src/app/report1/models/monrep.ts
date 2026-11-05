
import { GlobalVariables } from '../../core/models/globalvariables';

export class MonRep {
  sino: string;
  folder_no: string;
  folder_sent: string;
  mbl_no: string;
  mbl_date: number;
  mbl_status: string;
  hbl_no: number;
  hbl_date: number;
  hbl_status: string;
  shipper_name: string;
  consignee_name: string;
  agent_name: string;
  hbl_nomination: string;
  carrier_name: string;
  pol_name: string;
  pod_name: string;
  pofd_name: string;
  pol_etd: number;
  sman_name: string;
  hbl_grwt: number;
  hbl_chwt: number;
  mbl_grwt: number;
  mbl_chwt: number;
  netnet: string;
  publish_rate: number;
  informed_rate: number;
  sell_informed: string;
  rebate: number;
  exworks: number;
  commodty_name: string;

  hbl_type: string;
  hbl_book_cntr_teu: string;
  hbl_cbm: string;
  hbl_nature: string;
  hbl_book_cntr: string;
  hbl_job_nos: string;
  hbl_ntwt: string;

  mbl_nature: string;
  shipment_type: string;

  hbl_ar_invnos: string;
  hbl_ar_invamt: number;
  hbl_ar_gstamt: number;

  branch: string;
  agent_created_date: string;

  hbl_sell_rate_pp: number;
  hbl_sell_rate_cc: number;
  hbl_buy_rate_pp: number;
  hbl_buy_rate_cc: number;
  hbl_inv_status: string;
  hbl_inv_remarks: string;

  hbl_pkid: string;
  sman_id: string;
  displayed: boolean;

  created_date: string;

  _globalvariables: GlobalVariables;
}


export interface iMonRepModel {
  // filter Values
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  currentTab: string;
  ErrorMessage: string;

  RecordList: MonRep[];

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
  pendingInvoice: boolean;


  // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iMonRepModel = {
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  currentTab: '',
  RecordList: [],
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
  pendingInvoice: false,

  page_count: 0,
  page_current: 0,
  page_rows: 15,
  page_rowcount: 0


}

