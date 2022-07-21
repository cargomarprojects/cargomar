import { GlobalVariables } from "../../core/models/globalvariables";
export class MarkMarketingm {
    mark_id: string;
    mark_pkid: string;
    mark_visit_date: string;
    mark_customer_id: string;
    mark_customer_name: string;
    mark_contact_person: string;
    mark_deciding_person: string;
    mark_result: string;
    mark_next_action: string;
    mark_next_visit_date: string;
    mark_competition: string;
    mark_nomination: string;
    mark_last_shipment: string;
    mark_user_id: string;
    mark_user_name: string;
    mark_agent_name: string;
    mark_commodity: string;
    mark_mode: string;
    mark_newclient: boolean;
    mark_isjoincall: boolean;
    mark_jointsalesman_id: string;
    mark_jointsalesman_name: string;
    mark_time_visit: string;
    rec_category: string;
    mark_next_visit_status: string;

    mobile: string;
    email: string;
    target: string;

    rec_company_code: string;
    rec_branch_code: string;
    branch_name: string;
    rec_user_id: string;
    rec_date: string;
    rec_mode: string;
    rec_created_date: string;

    row_displayed: boolean = false;

    _globalvariables: GlobalVariables;
}


export class MarkReport {
    user_id: string;
    user_name: string;
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
    total: number;
    _globalvariables: GlobalVariables;
}