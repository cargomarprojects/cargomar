import { GlobalVariables } from '../../core/models/globalvariables';
import { Dailyexpd } from './dailyexpd';

export class Dailyexpm {
    dem_pkid: string;
    dem_year: number;
    dem_cfno: number;
    dem_date: string;
    dem_genjob_id: string;
    dem_genjob_no: string;
    dem_genjob_prefix: string;
    dem_party_id: string;
    dem_party_code: string;
    dem_party_name: string;
    dem_party_br_id: string;
    dem_party_br_no: string;
    dem_party_br_addr: string;
    dem_inv_date: string;
    dem_exp_date: string;
    dem_edit_code: string;

    dem_party_br_gst: string;
    dem_driver_name: string;
    dem_container: string;
    dem_vehicle_no: string;
    dem_from: string;
    dem_to: string;

    lock_record:boolean;
    rec_mode: string;
    _globalvariables: GlobalVariables;

    detList: Dailyexpd[] = [];
}