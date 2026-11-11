
import { GlobalVariables } from '../../core/models/globalvariables';

export class BkTeu {

  cntr_pkid: string;
  cntr_no: string;
  cntr_type_code: string;
  cntr_booking_no: string; 
  cntr_clearing: string;
  mbl_no: string;
 
  mbl_pol_etd: string;
  mbl_shipment_type: string;
  mbl_nature: string;
  mbl_book_cntr_mcbm: number;
  mbl_book_cntr_m20: number;
  mbl_book_cntr_m40: number;
  mbl_book_cntr_mteu: number;

  hbl_pol: string;
  hbl_pod: string;
  hbl_pofd: string;
  hbl_agent: string;
  hbl_nomination:String;
  branch: string;

    _globalvariables: GlobalVariables;
}

export interface iBkTeuModel {
  // filter Values
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  list_format: string;
  currentTab: string;
  RecordList: BkTeu[];

  ErrorMessage: string;

  type_date: string;
  from_date: string;
  to_date: string;
  // year_code: string;
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
  all: boolean;

  // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iBkTeuModel = {
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  list_format: '',
  currentTab: '',
  RecordList: [],

  ErrorMessage: '',

  type_date: '',
  from_date: '',
  to_date: '',
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
  all: false,

  page_count: 0,
  page_current: 0,
  page_rows: 15,
  page_rowcount: 0
}
