
import { GlobalVariables } from '../../core/models/globalvariables';

export class Brok {

  row_type: string;
  row_colour: string;
  branch: string;
  jvh_vrno: string;
  jvh_date: string;
  hbl_no: string;
  hbl_bl_no: string;
  hbl_date: string;
  vessel: string;
  hbl_vessel_no: string;
  hbl_terms: string;
  hbl_nature: string;
  carrier: string;
  agent: string;
  shipper: string;
  consignee: string;
  jvh_reference: string;
  jvh_reference_date: string;
  jvh_org_invno: string;
  jvh_org_invdt: string;
  jvh_basic_frt: number;
  jvh_brok_per: number;
  jvh_brok_amt: number;
  jvh_brok_exrate: number;
  jvh_brok_amt_inr: number;

  _globalvariables: GlobalVariables;
}
