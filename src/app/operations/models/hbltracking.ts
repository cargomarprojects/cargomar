import { GlobalVariables } from '../../core/models/globalvariables';

export class HblTracking {
    parent_id: string;
    parent_type: string;
    mbook_confirmed_date: string;
    mstuff_confirmed_date: string;
    mgate_in_date: string;
    mvgm_updated_date: string;
    hdraft_sent_date: string;
    hinvoice_sent_date: string;
    hbl_approved_date: string;
    hpayment_received_date: string;
    hbl_released_date: string;
    delivered_date: string;
    pre_position_date: string;
    msi_filing_date: string;
    mbl_approved_date: string;
    mbl_payment_date: string;
    mbl_released_date: string;
    mbl_empty_pickup_date:string;
    
    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
}
