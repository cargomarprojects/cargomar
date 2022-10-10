
import { GlobalVariables } from '../../core/models/globalvariables';

export class PayRequestm {
  pay_pkid: string;
  pay_year: number;
  pay_date: string;
  pay_no: number;
  pay_docno: string;
  pay_docdate: string;
  pay_type: string;
  pay_subtype: string;
  pay_acc_id: string;
  pay_acc_code: string;
  pay_acc_name: string;
  pay_jvh_id: string;
  pay_parent_id: string;
  pay_parent_type: string;
  pay_request_id: string;
  pay_request_code: string;
  pay_request_name: string;
  pay_amt: number;
  rowdisplayed: boolean;
  pay_chq_name: string;
  pay_is_paid: string;
  pay_remarks:string;
  pay_org_invno: string;
  pay_org_invdt: string;
  mbl_slno: number;
  mbl_book_no: string;
  mbl_mblno: string;
  mbl_date: string;
  pay_curr_code: string;
  pay_exrate: number;
  pay_famt: number;
  
  rec_mode: string;
  _globalvariables: GlobalVariables;

}
