import { GlobalVariables } from '../../core/models/globalvariables';
export class MarkSalesleadm {
    msl_pkid: string;
    msl_location_id: string;
    msl_location_name: string;
    msl_date: string;
    msl_shipper_id:string;
    msl_shipper_code:string;
    msl_shipper_name: string;
    msl_shipper_add1: string;
    msl_shipper_add2: string;
    msl_shipper_add3: string;
    msl_city: string;
    msl_pic: string;

    msl_consignee_id:string;
    msl_consignee_code:string;
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
    msl_agent_id: string;
    msl_agent_name: string;
    msl_terms: string;
    msl_commodity: string;
    msl_volume: string;
    msl_pol_id:string;
    msl_pol_code:string;
    msl_pol: string;
    msl_pod_id:string;
    msl_pod_code:string;
    msl_pod: string;
    msl_competition: string;
    msl_type: string;
    msl_converted: string;
    msl_country_id: string;
    msl_country_code: string;
    msl_country: string;
    msl_status:string;
    msl_slno:number;
    msl_buyagent_id:string;
    msl_buyagent_code:string;
    msl_buyagent_name:string;
    msl_recommendation:string;    
    rowdisplayed: boolean = false;
    rec_mode: string;
    rec_user_id: string;
    rec_created_by: string;
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
    msld_doc_attached:string;
    msld_category: string;
    msld_status: string;

    rec_mode: string;
    _globalvariables: GlobalVariables;

}
