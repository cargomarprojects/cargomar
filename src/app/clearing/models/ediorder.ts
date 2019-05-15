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

