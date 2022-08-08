import { GlobalVariables } from '../../core/models/globalvariables';

export class Trackingm {

  trk_pkid: string;
  trk_parent_id: string;
  trk_vsl_id: string;
  trk_vsl_code: string;
  trk_vsl_name: string;
  trk_voyage: string;
  trk_pol_id: string;
  trk_pol_code: string;
  trk_pol_name: string;
  trk_pol_etd: string;
  trk_pol_etd_confirm: boolean;
  trk_pod_id: string;
  trk_pod_code: string;
  trk_pod_name: string;
  trk_pod_eta: string;
  trk_pod_eta_confirm: boolean;
  trk_order: number;
  trk_desc: string;
  rec_mode: string;
  rec_category: string;
  mbl_slno: number;
  mbl_book_no: string;
  mbl_no: string;
  mbl_cntrs: string;
  mbl_agent_name: string;
  mbl_liner_name: string;
  mbl_shipper_name: string;
  mbl_consignee_name: string;
  trk_vsl_count: number;
  row_colour:string;
  trk_si_cutoff: string;
  trk_cy_cutoff: string;

  _globalvariables: GlobalVariables;
}

