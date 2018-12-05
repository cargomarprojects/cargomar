
import { GlobalVariables } from '../../core/models/globalvariables';

export class TeuClr {

  job_date: string;
  cntr_teu: number;
  cntr_20_tot: number;
  cntr_40_tot: number;
  job_nature: string;
  job_nomination: string;
  
  cntr_pkid: string;
  cntr_no: string;

  cntr_csealno: string;
  cntr_asealno: string;
  cntr_type_code: string;
  cntr_booking_no: string;
  cntr_stuffed_at: string;
  cntr_stuffed_on: string;
  cntr_pcs: number;
  cntr_ntwt: number;
  cntr_grwt: number;
  cntr_cbm: number;
  cntr_clearing: string;

  mbl_no: string;
  mbl_book_no: string;
  mbl_pol_etd: string;
  mbl_shipment_type: string;
  mbl_nature: string;
  hbl_exp_name: string;
  hbl_imp_name: string;

  hbl_agent_name: string;
  hbl_carrier_name: string;
  hbl_pol_name: string;
  hbl_pod_name: string;
  hbl_pofd_name: string;
  branch: string;


  _globalvariables: GlobalVariables;
}
