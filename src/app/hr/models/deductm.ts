
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
    ded_alloc_exist: boolean;
    ded_slno: number;
    monthly_deducted_amt: number;
    valid_deduction: string;
    pending_amt: number;
    ded_pay_date: string;
    ded_vrno: string;
    rec_mode: string;
    rec_branch_code: string;
    ded_deduct_amt: number;
    _globalvariables: GlobalVariables;
    dedList: Deductd[] = [];
}

export class Deductd {
    ded_pkid: string;
    ded_parent_id: string;
    ded_emp_id: string;
    ded_emp_code: string;
    ded_emp_name: string;
    ded_start_date: string;
    ded_type: string;
    ded_mon: number;
    ded_year: number;
    ded_amt: number;
    ded_paid_amt: number;
    ded_collected_amt: number;
    ded_bal_amt: number;
    ded_slno: number;
    ded_edit_code: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_edited_by: string;
    rec_edited_date: string;
    ded_remarks: string;
    ded_fin_year: number;
    ded_deduct_source: string;
}