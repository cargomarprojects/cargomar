
import { GlobalVariables } from '../../core/models/globalvariables';

export class Deductm {
    ded_pkid: string;
    ded_emp_id: string;
    ded_emp_code: string;
    ded_emp_name: string;
    ded_start_date: string;
    ded_type: string;
    ded_type_code: string;
    ded_paid_amt: number;
    ded_mon_amt: number;
    ded_tot_months: number;
    ded_collected_amt: number;
    ded_bal_amt: number;
    ded_closed: string;
    ded_edit_code: string;
    ded_amt: number;
    ded_remarks: string;
    ded_sal_pkid: string;
    
    rec_mode: string;
    _globalvariables: GlobalVariables;
    dedList: Deductd[] = [];
}

export class Deductd {
    ded_pkid: string;
    ded_parent_id: string;
    ded_emp_id: string;
    ded_emp_code: string;
    ded_emp_name: string;
    ded_type: string;
    ded_mon: number;
    ded_year: number;
    ded_amt: number;
    ded_edit_code: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_edited_by: string;
    rec_edited_date: string;
}