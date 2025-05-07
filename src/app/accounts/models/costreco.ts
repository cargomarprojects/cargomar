
import { GlobalVariables } from '../../core/models/globalvariables';

export class Costreco {
  sql_type: string;
  row_type: string;
  row_colour: string;


  mbl_pkid: string;
  mbl_no: string;
  mbl_bl_no: string;
  mbl_book_no: string;
  hbl_no: string;
  hbl_bl_no: string;

  agent_name: string;
  hbl_type: string;
  jvh_date: string;
  jvh_type: string;
  jvh_vrno: string;

  acc_name: string;
  jvh_cc_category: string;
  ct_category: string;
  jvh_remarks: string;
  jvh_narration: string;

  mstat: string;
  hstat: string;

  cust_name: string;
  sman_name: string;
  grwt: number;
  chwt: number;
  teu: number;
  cbm: number;



  acc_code: number;
  jvh_cc_id: number;
  jv_debit: number;
  jv_credit: number;
  jv_balance: number;

  coldr0: number;
  colcr0: number;

  coldr1: number;
  colcr1: number;

  coldr2: number;
  colcr2: number;

  cc_pkid: string;
  recon_closed: string;

  _globalvariables: GlobalVariables;

}
