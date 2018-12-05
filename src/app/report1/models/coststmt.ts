
import { GlobalVariables } from '../../core/models/globalvariables';

export class Coststmt {

  rowtype: string;
  rowcolor: string;
  jv_acc_id: string;
  roworder2: string;
  jvh_date: string;
  curr_code: string;
  jvh_vrno: string;
  jvh_type: string;
  jvh_remarks: string;
  jvh_reference: string;
  rec_category: string;
  jv_debit: number;
  jv_credit: number;
  jv_exrate: number;
  inr: number;
  opening: number;

  branch: string;

  _globalvariables: GlobalVariables;
}
