import { GlobalVariables } from '../../core/models/globalvariables';

export class EdiOrder {
  pkid: string;
  parent_id: string;
  id_po: string;
  status: string;
  division: string;
  model_sku: string;
  po: string;
  supplier_po: string;
  po_before: string;
  consignee_id: string;
  consignee_name: string;
  origin_country: string;
  pol: string;
  pod: string;
  transport_way: string;
  supplier_id: string;
  supplier_name: string;
  cargo_desc: string;
  window1: string;
  window2: string;
  instock1: string;
  instock2: string;
  factory: string;
  incoterm: string;
  import_executive: string;
  updated:string;
  agent_ref_no:string;
  selected:boolean;
  
  comp_pol_code:string;
  rec_mode: string;
  rec_category: string;
  _globalvariables: GlobalVariables;
}

export interface iEdiOrderModel {
  // filter Values
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  list_format: string;
  currentTab: string;
  RecordList: EdiOrder[];

  ErrorMessage: string;
  InfoMessage: string;

  //Search Values
  selectcheck: boolean;
  agent_id: string;
  update_type: string;
  chk_all_pol: boolean;
  searchstring: string;
  ord_po_aprvd: string;

  // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iEdiOrderModel = {
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  list_format: '',
  currentTab: '',
  RecordList: [],
  
  ErrorMessage: '',
  InfoMessage: '',

  selectcheck: false,
  agent_id: '',
  update_type: '',
  chk_all_pol: false,
  searchstring: '',
  ord_po_aprvd: '',

  page_count: 0,
  page_current: 0,
  page_rows: 15,
  page_rowcount: 0
}

