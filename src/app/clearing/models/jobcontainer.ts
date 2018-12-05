import { GlobalVariables } from '../../core/models/globalvariables';

export class JobContainer {
  cntr_pkid: string;
  cntr_job_id: string;
  cntr_slno: number;
  cntr_no: string;
  cntr_sealno: string;
  cntr_sealdate: string;
  cntr_size: string;
  cntr_type: string;
  cntr_pkts: number;
  cntr_transporter: string;
  cntr_sealtype: string;
  cntr_sealdevice_id: string;
  cntr_movdoc_type: string;
  cntr_movdoc_number: string;

  rec_mode: string;
  rec_category: string;
  _globalvariables: GlobalVariables;
}

