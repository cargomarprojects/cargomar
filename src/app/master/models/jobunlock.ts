import { GlobalVariables } from '../../core/models/globalvariables';
export class JobUnlock {

    ul_pkid: string;
    ul_parent_id: string;
    ul_type: string;
    ul_ctr: number;
    ul_remarks: string;
    ul_comments: string;
    ul_remarks_id: string;
    shipper_name: string;
    consignee_name: string;
    billto_name: string;
    cust_name: string;
    ul_from_email_id: string;
    ul_firm_commited_date: string;
    ul_expected_bill_amt: number;
    ul_job_nos_required: number;
    ul_locked: string;
    ul_sman_id: string;
    ul_sman_code: string;
    ul_sman_name: string;
    ul_selected: boolean;
    ul_approved_by: string;
    ul_approved_date: string;
    ul_user_remarks: string;
    ul_bal_amt: number;
    ul_overdue_amt: number;
    ul_lock_type: string;
    ul_consignee_id: string;
    ul_consignee_name: string;

    rec_mode: string;

    rec_company_code: string;
    rec_branch_code: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_deleted_by: string;
    rec_deleted_date: string;

    _globalvariables: GlobalVariables;
}