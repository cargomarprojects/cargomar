
import { GlobalVariables } from '../../core/models/globalvariables';

export class Deductm {
    ded_pkid: string;
    ded_emp_id: string;
    ded_emp_code: string;
    ded_emp_name: string;
    ded_start_date: string;
    ded_type: string;
    ded_paid_amt: number;
    ded_mon_amt: number;
    ded_tot_months: number;
    ded_collected_amt: number;
    ded_bal_amt: number;
    ded_closed: string;
    ded_edit_code: string;
    ded_amt: number;

    rec_mode: string;
    _globalvariables: GlobalVariables;
}
