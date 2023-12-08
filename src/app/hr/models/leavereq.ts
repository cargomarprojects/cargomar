import { GlobalVariables } from '../../core/models/globalvariables';

export class LeaveReq {
    lr_pkid: string;
    lr_emp_id: string;
    lr_emp_code: string;
    lr_emp_name: string;
    lr_apply_date: string;
    lr_from_date: string;
    lr_to_date: string;
    lr_join_date: string;
    lr_cl_days: number;
    lr_cl_half_days: number;
    lr_sl_days: number;
    lr_sl_half_days: number;
    lr_pl_days: number;
    lr_pl_half_days: number;
    lr_lop_days: number;
    lr_lop_half_days: number;
    lr_remarks: string;

    lr_approved_by: string;
    lr_approved_date: string;
    lr_sanctioned_by: string;
    lr_sanctioned_date: string;
    lr_rejected_by: string;
    lr_rejected_date: string;
    lr_is_travelling: boolean;
    lr_travelling_days: number;
    lr_travelling_half_days: number;
    lr_emp_branch_name:string;

    lr_edit_code: string;
    rec_mode: string;
    rec_category: string;

    _globalvariables: GlobalVariables;
}
