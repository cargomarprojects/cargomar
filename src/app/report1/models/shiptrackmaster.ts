
import { GlobalVariables } from '../../core/models/globalvariables';

export class ShipTrackMaster {

    mbl_bk: number;
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
    pod_eta: string;
    pod_eta_confirm: boolean;
    pofd_eta: string;
    pofd_eta_confirm: boolean;
    status: string;
    transit_etd: string;
    transit_status: string;
    final_status: string;

    row_displayed: boolean;
    _globalvariables: GlobalVariables;
}
