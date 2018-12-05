
import { GlobalVariables } from '../../core/models/globalvariables';
import { TaxPland } from '../../hr/models/taxpland';

export class TaxPlanm {

  tpm_pkid: string;
  tpm_year: number;
  tpm_user_id: string;
  tpm_user_code: string;
  tpm_user_name: string;
  tpm_tot_amt: number;

  tpm_branch: string;

  rec_created_date: string;
  rec_created_by: string;
  rec_mode: string;
  _globalvariables: GlobalVariables;

  DetailList: TaxPland[] = [];
}
