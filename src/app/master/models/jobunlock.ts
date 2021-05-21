import { GlobalVariables } from '../../core/models/globalvariables';
export class JobUnlock {

    ul_pkid: string;
    ul_parent_id: string;
    ul_type: string;
    ul_ctr: number;
    ul_remarks: string;
    
    rec_mode: string;

    rec_company_code: string;
    rec_branch_code: string;

    rec_created_by: string;
    rec_created_date: string;

    _globalvariables: GlobalVariables;
}