
import { GlobalVariables } from '../../core/models/globalvariables';

export class ApprovedDet {
    ad_pkid: string;
    ad_parent_id: string;
    ad_status: string;
    ad_remarks: string;
    ad_order: number;
    rec_mode: string;
    rec_category:string;
    rec_created_by: string;
    rec_created_date: string;
    _globalvariables: GlobalVariables;
}
