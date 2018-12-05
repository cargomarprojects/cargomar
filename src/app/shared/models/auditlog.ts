
import { GlobalVariables } from '../../core/models/globalvariables';

export class Auditlog {
  audit_date: string;
  audit_module: string;
  audit_type: string;
  audit_action: string;
  audit_comp_code: string;
  audit_branch_code: string;
  audit_user_code: string;
  audit_pkey: string;
  audit_refno: string;
  audit_computer: string;
  audit_old_amt: number;
  audit_new_amt: number;
  audit_old_remarks: string;
  audit_remarks: string;

  rec_mode: string;
  _globalvariables: GlobalVariables;
}
