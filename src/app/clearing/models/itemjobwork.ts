import { GlobalVariables } from '../../core/models/globalvariables';

export class ItemJobwork {

  jw_pkid: string;
  jw_job_id: string;
  jw_itm_id: string;
  jw_be_no: string;
  jw_be_date: string;
  jw_be_inv_slno: string;
  jw_be_inv_no: string;
  jw_be_itm_slno: string;
  jw_be_port_id: string;
  jw_be_port_code: string;
  jw_be_port_name: string;
  jw_be_qty: number;
  jw_be_unit_id: string;
  jw_be_unit_code: string;
  jw_be_unit_name: string;
  jw_ctr: number;

  rec_mode: string;
  rec_category: string;
  _globalvariables: GlobalVariables;
}

