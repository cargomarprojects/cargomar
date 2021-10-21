
import { GlobalVariables } from '../../core/models/globalvariables';
 //EDIT-AJITH-24-09-2021
 
export class MailList {
  
  ml_pkid: string;
  ml_type: string;
  ml_to_ids: string;
  ml_cc_ids: string;
  ml_bcc_ids: string;
  ml_cust_id: string;
  ml_cust_code: string;
  ml_cust_name: string;
  ml_cust_type: string;
  ml_remarks: string;

  rec_mode: string;
  rec_locked:boolean;
  rec_checked:boolean;

  _globalvariables: GlobalVariables;

}

