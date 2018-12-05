
import { GlobalVariables } from '../../core/models/globalvariables';

export class TrackReport {
  sl_no: number;
  cntr_no: string;
  hbl_bl_no: string;
  vessel_name: string;
  voyage: string;
  pol_name: string;
  pol_etd: string;
  pol_etd_confirm: string;
  pod_name: string;
  pod_eta: string;
  pod_eta_confirm: string;

  _globalvariables: GlobalVariables;
}
