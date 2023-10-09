
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

  rec_locked: boolean;
  rec_mode: string;

  _globalvariables: GlobalVariables;

}

