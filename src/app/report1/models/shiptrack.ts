
import { GlobalVariables } from '../../core/models/globalvariables';

export class ShipTrack {

    mbl_agent_name: string;
    mbl_carrier_name: string;
    mbl_exp_name: string;
    mbl_imp_name: string;
    mbl_book_no: string;
    mbl_book_slno:number;
    mbl_no: string;
    mbl_date: string;
    mbl_pol_name: string;
    mbl_pod_name: string;
    mbook_confirmed_date: string;
    mstuff_confirmed_date: string;
    mgate_in_date: string;
    mvgm_updated_date: string;
    mbl_pol_etd:string;
    mbl_pod_eta:string;
    hdraft_sent_date:string;
    hinvoice_sent_date:string;
    hbl_approved_date:string;
    hpayment_received_date:string;
    hbl_released_date:string;
    msi_filing_date:string;
	mbl_approved_date:string;
	mbl_payment_date:string;
	mbl_released_date:string;
	mbl_empty_pickup_date:string;

    _globalvariables: GlobalVariables;
}
