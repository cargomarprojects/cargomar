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
    
    lr_edit_code:string;
    rec_mode: string;
    rec_category:string;

    _globalvariables: GlobalVariables;
}
