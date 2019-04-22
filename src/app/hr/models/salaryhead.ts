
import { GlobalVariables } from '../../core/models/globalvariables';

export class SalaryHead {
  sal_pkid: string;
  sal_code: string;
  sal_desc: string;
  sal_head: string;
  sal_head_order: number;
  sal_acc_id: string;
  sal_acc_code: string;
  sal_acc_name: string;
  
  rec_mode: string;

  _globalvariables: GlobalVariables;
}
