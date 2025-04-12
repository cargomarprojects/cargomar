
import { GlobalVariables } from '../../core/models/globalvariables';

export class ShipTrackMaster {

    exp_name: string;
    imp_name: string;
    carrier_name: string;
    book_no: string;
    mbl_id: string;
    mbl_no: string;
    mbl_date: string;
    pol_name: string;
    pod_name: string;
    cntr_no: string;
    hbl_no: string;
    vessel: string;
    voyage: string;
    etd: string;
    etd_confirm: boolean;
    eta: string;
    eta_confirm: boolean;

    row_displayed: boolean;
    _globalvariables: GlobalVariables;
}
