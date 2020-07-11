
import { GlobalVariables } from '../../core/models/globalvariables';
 
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

  rec_mode: string;

  _globalvariables: GlobalVariables;

}

