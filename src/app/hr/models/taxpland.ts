
import { GlobalVariables } from '../../core/models/globalvariables';

export class TaxPland {
  tpd_pkid: string;
  tpd_parent_id: string;
  tpd_plan_id: string;
  tpd_plan_desc: string;
  tpd_plan_group_ctr: number;
  tpd_plan_ctr: number;
  tpd_plan_limit: number;
  tpd_plan_editable: boolean;
  tpd_plan_bold: boolean;
  tpd_year: number;
  tpd_user_id: string;
  tpd_amt_invested: number;
  tpd_amt_before_dec31: number;
  tpd_amt_after_dec31: number;
  tpd_amt_tot: number;

  rec_mode: string;

  _globalvariables: GlobalVariables;
}
