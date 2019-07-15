
import { GlobalVariables } from '../../core/models/globalvariables';
 
export class Drawback {
  dbk_id: string;
  dbk_slno: string;
  dbk_name: string;
  dbk_type: string;
  dbk_unit: string;
  dbk_rate_excise: number;
  dbk_rate_custom: number;
  dbk_rate: number;
  dbk_valuecap: number;
  dbk_state_rt: number;
  dbk_state_valuecap: number;
  dbk_ctl_rt: number;
  dbk_ctl_valuecap: number;
  dbk_notdt: string;
  dbk_rosl_notdt: string;
  rec_mode: string;

  _globalvariables: GlobalVariables;

}

