
import { GlobalVariables } from '../../core/models/globalvariables';

export class qtnm {
  qtn_pkid: string;
  qtn_type: string;
  qtn_party_id: string;
  qtn_party_code: string;
  qtn_party_name: string;
  qtn_remarks: string;

  rec_mode: string;
  Record: qtnd;

  _globalvariables: GlobalVariables;

  qtnList: qtnd[] = [];
}


export class qtnd {
  qtnd_pkid: string;

  qtnd_parent_id: string;

  qtnd_type: string;

  qtnd_acc_id: string;
  qtnd_acc_code: string;
  qtnd_acc_name: string;
  qtnd_acc_main_code: string;

  qtnd_cntr_type_id: string;
  qtnd_cntr_type_code: string;
  
  qtnd_curr_id: string;
  qtnd_curr_code: string;

  qtnd_qty: number;
  qtnd_rate: number;
  qtnd_exrate: number;
  qtnd_total: number;
  qtnd_remarks: string;

  rec_mode: string;
}
