import { GlobalVariables } from '../../core/models/globalvariables';

export class StuffingReport {

  job_exp_name: string;
  job_imp_name: string;
  job_pofd_name: string;
  opr_sbill_no: string;
  opr_sbill_date: string;
  pack_pkg: number;
  pack_cbm: number;
  pack_grwt: number;
  pack_cntr_no: string;
  pack_cntr_csealno: string;
  pack_cntr_asealno: string;
  mbl_vessel_name: string;
  mbl_vessel_voyage: string;
  mbl_pol_etd: string;
  mbl_pol_etd_confirm: string;
  mbl_pod_eta: string;
  itm_order_no: string;
  itm_uneco: string;
  itm_styleno: string;

  rec_mode: string;
  _globalvariables: GlobalVariables;
}

