
import { GlobalVariables } from '../../core/models/globalvariables';

export class Ritcm {

  ritc_pkid: string;
  ritc_code: string;
  ritc_name: string;
  ritc_unit: string;

  ritc_rate: number;
  ritc_cap: number;

  ritc_notify_date: string;
  ritc_info_code: boolean;

  ritc_is_rodtep: string;
  ritc_is_verified: string;
  ritc_verified_by: string;
  ritc_verified_date: string;


  rec_locked: boolean;
  rec_mode: string;

  _globalvariables: GlobalVariables;

}

