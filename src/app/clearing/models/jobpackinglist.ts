import { GlobalVariables } from '../../core/models/globalvariables';

export class JobPackinglist {
  pack_pkid: string;
  pack_job_id: string;
  pack_from: number;
  pack_to: number;
  pack_type_id: string;
  pack_type_code: string;
  pack_type_name: string;
  pack_order: number;
  pack_source: string;
  pack_ctns: number;


  
  rec_mode: string;
  rec_category: string;
  _globalvariables: GlobalVariables;
}

