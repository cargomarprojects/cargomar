
import { GlobalVariables } from '../../core/models/globalvariables';

export class Tdsrate {
    rec_edited_date: string;
    rec_edited_by: string;
    rec_mode: string;
    _globalvariables: GlobalVariables;

    rateList: Tdsratedet[] = [];
}

export class Tdsratedet {

    tr_pkid: string;
    tr_fin_year: number;
    tr_code: string;
    tr_name: string;
    tr_huf_rate: number;
    tr_other_rate: number;
    tr_pan_inoper_rate: number;
    tr_tech_service_rate: number;
}