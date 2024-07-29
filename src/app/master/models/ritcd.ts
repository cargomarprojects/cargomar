
import { GlobalVariables } from '../../core/models/globalvariables';

export class Ritcd {

    ritcd_pkid: string;
    ritcd_parent_id: string;
    ritcd_scheme_id: string;
    ritcd_scheme_code: string;
    ritcd_scheme_name: string;
    ritcd_rate: number;
    ritcd_cap: number;
    ritcd_effective_date: string;

    rec_created_by: string;
    rec_created_date: string;
    rec_locked: boolean;
    rec_mode: string;

    _globalvariables: GlobalVariables;

}

