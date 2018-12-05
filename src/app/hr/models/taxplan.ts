
import { GlobalVariables } from '../../core/models/globalvariables';

export class TaxPlan {
  tp_pkid: string;
  tp_year: number;
  tp_group_ctr: number;
  tp_ctr: number;
  tp_desc: string;
  tp_limit: number;
  tp_editable: boolean;
  tp_bold: boolean;
  
  rec_mode: string;

  _globalvariables: GlobalVariables;
}
