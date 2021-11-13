import { GlobalVariables } from '../../core/models/globalvariables';
export class MarkSalesleadm {
    msl_pkid: string;
    msl_location_id: string;
    msl_location_name: string;
    msl_date: string;
    msl_shipper_name: string;
    msl_shipper_add1: string;
    msl_shipper_add2: string;
    msl_shipper_add3: string;
    msl_city: string;
    msl_pic: string;
    msl_consignee: string;
    msl_destination: string;
    msl_action: string;
    msl_remarks: string;
    msl_followupcount: string;
    msl_shipper_tel: string;
    msl_shipper_email: string;
    msl_consignee_add1: string;
    msl_consignee_add2: string;
    msl_consignee_add3: string;
    msl_consignee_pic: string;
    msl_consignee_tel: string;
    msl_consignee_email: string;

    rowdisplayed: boolean = false;
    rec_mode: string;
    _globalvariables: GlobalVariables;
}

export class MarkSalesleadd {
    msld_pkid: string;
    msld_parent_id: string;
    msld_user_id: string;
    msld_user_name: string;
    msld_date: string;
    msld_remarks: string;
    msld_action_plan: string;
    
    rec_mode: string;
    _globalvariables: GlobalVariables;

}