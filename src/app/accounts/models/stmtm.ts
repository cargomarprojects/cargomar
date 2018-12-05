
import { GlobalVariables } from '../../core/models/globalvariables';

export class Stmtm {

  stm_pkid : string;
  stm_no : number;
  stm_year : number;
  stm_accid : string;
  stm_acc_code: string;
  stm_acc_name: string;

  stm_acc_br_id: string;
  stm_acc_br_no: string;
  stm_acc_br_addr: string;

  stm_curr_code: string;
  stm_isgroup : string;
  stm_date : string;
  stm_currencyid: string;

  stm_dr: number;
  stm_cr: number;
  stm_bal: number;


  stm_dr_inr: number;
  stm_cr_inr: number;
  stm_bal_inr: number;


  stm_edit_code: string;
  stm_edit_date: string;


  rec_created_by: string;
  rec_cretated_date: string;
  rec_mode: string;
  rec_locked: string;

   PendingList: Stmtd[] = [];



  _globalvariables: GlobalVariables;
}



export class Stmtd {

  std_pkid: string;
  std_parentid: string;
  jv_entity_id: string;
  jv_pk_id: string;
  jv_ac_rowid: string;
  jv_location: string;
  jv_year: number;
  jv_vrno: number;
  jv_type: string;
  jv_date: string;
  jv_display_date: string;
  jv_remarks: string; 
  jv_reference: string;
  jv_narration: string;
  jv_currency_rowid: string;
  jv_debit: number;
  jv_credit: number;
  jv_exchange_rate: number;
  inrbalance: number;
  inrallocation: number; 
  amount: number;
  dr: number;
  cr: number;
  balance: number;
  allocation: number; 
  jv_selected: boolean;
  rec_category: string;
  folderno: string;
}

