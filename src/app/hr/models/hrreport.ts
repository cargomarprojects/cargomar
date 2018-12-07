
import { GlobalVariables } from '../../core/models/globalvariables';

export class HrReport {
  row_type: string;
  row_colour: string;
  emp_no: string;
  emp_name: string;
  emp_pfno: string;
  pf_base_salary:number;
  pf_deduction:number;
  emplyr_share:number;
  pension:number;
  vpf:number;
  admin_chrg:number;
  edli_chrg:number;
  total_chrg:number;
  eps_amt:number;
  branch:string;
  
  _globalvariables: GlobalVariables;
}
