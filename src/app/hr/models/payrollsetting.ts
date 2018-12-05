
import { GlobalVariables } from '../../core/models/globalvariables';

export class PayrollSetting {
  ps_pkid: string;
  ps_admin_per: number;
  ps_admin_amt: number;
  ps_admin_based_on: string;
  ps_edli_per: number;
  ps_edli_amt: number;
  ps_edli_based_on: string;
  ps_esi_emplr_per: number;
  ps_esi_limit: number;
  ps_pf_emplr_pension_per: number;
  ps_pf_cel_limit: number;
  ps_pf_cel_limit_amt: number;
  ps_pf_col_excluded:string
  ps_pf_per: number;
  ps_esi_emply_per: number;
  ps_pf_br_region: string;

  rec_mode: string;

  _globalvariables: GlobalVariables;
}
