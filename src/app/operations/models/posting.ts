
import { GlobalVariables } from '../../core/models/globalvariables';


export class Posting {

  category: string;

  mbl_pkid: string;
  mbl_type: string;
  
  jv_type: string;
  jv_year: string;
  jv_date: string;

  jv_br_record_pkid: string;
  
  jv_ho_id: string;
  jv_ho_code: string;
  jv_ho_name: string;

  jv_frt_id: string;
  jv_frt_code: string;
  jv_frt_name: string;

  jv_ho_record_pkid: string;
  jv_agent_id: string;
  jv_agent_code: string;
  jv_agent_name: string;
  jv_agent_br_id: string;

  jv_br_id: string;
  jv_br_code: string;
  jv_br_name: string;

  jv_ftotal: number;
  
  jv_curr_id: string;
  jv_curr_code: string;
  jv_exrate: number  ;

  jv_total: number;
  jv_debit: number;
  jv_credit: number;

  jv_drcr: string;

  jv_reference: string;
  jv_remarks: string;
  jv_narration: string;


  jv_location: string;


  jv_posted: string;
  jv_posted_details: string;

  rec_mode: string;
  rec_category: string;



  _globalvariables: GlobalVariables;


}
