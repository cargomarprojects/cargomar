
import { GlobalVariables } from '../../core/models/globalvariables';

export class Rebatem {
  jvhid: string;
  jvh_vrno: string;
  jvh_date: string;
  jvh_narration: string;
  jvh_cc_category: string;
  jvh_cc_id: string;
  jvh_amount: number;

  jvhid_ho: string;
  jvh_vrno_ho: string;

  rec_mode: string;
  rebate_type: string;
  RebateList: Rebate[] = [];
  _globalvariables: GlobalVariables;
}

export class Rebate {

  inv_pkid: string;
  inv_no: string;
  hbl_no: string;
  inv_source: string;
  hbl_pkid: string;
  hbl_type: string;
  mbl: string;
  hbl: string;
  jobnos: string;
  created: string;
  shipper_name: string;
  carrier_name: string;
  inv_type: string;
  acc_main_code: string;
  acc_code: string;
  acc_name: string;
  inv_qty: number;
  inv_rate: number;
  inv_fototal: number;
  inv_curr_code: string;
  inv_exrate : number ;
  inv_total : number ;
  inv_rebate_amt: number;
  inv_rebate_curr_code: string;
  inv_rebate_exrate : number ;
  inv_rebate_amt_inr: number;

  inv_rebate_jvid: string;
  inv_rebate_jvno: string;

  inv_rebate_jvid_ho: string;
  inv_rebate_jvno_ho: string;

  posted: string;
  selected: boolean;

  inv_date: string;
  inv_rebate_jvdate: string;
  branch: string;
  salesman: string;
  consignee_name: string;

  inv_date_original: string;
  inv_rebate_jvdate_original: string;


  paid_vrno: string;
  paid_date: string;
  paid_amt: number;

  inv_paid_docno: string;
  inv_paid_date: string;
  in_paid_amt: number;

  _globalvariables: GlobalVariables;
}
