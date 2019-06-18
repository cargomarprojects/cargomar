
import { GlobalVariables } from '../../core/models/globalvariables';

export class Bonusm {
  bon_pkid: string;
  bon_emp_id: string;
  bon_emp_code: string;
  bon_emp_name: string;
  bon_fin_year: number;
  bon_days_worked: number;
  bon_gross_wages: number;
  bon_gross_bonus: number;
  bon_puja_deduct: number;
  bon_interim_deduct: number;
  bon_tax_deduct: number;
  bon_other_deduct: number;
  bon_tot_deduct: number;
  bon_net_amount: number;
  bon_actual_paid: number;
  bon_paid_date: string;
  bon_remarks: string;
  bon_selected:boolean;
  bon_emp_grade:string;
  
  rec_mode: string;
  _globalvariables: GlobalVariables;
}
