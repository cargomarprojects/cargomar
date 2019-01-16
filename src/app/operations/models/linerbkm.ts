import { GlobalVariables } from '../../core/models/globalvariables';
import { Hblm } from '../../operations/models/hbl';
import { BkmCntrtype } from './bkmcntrtype';
import { BkmPayment } from './bkmpayment';

export class LinerBkm {
  book_pkid: string;
  book_slno: number;
  book_booked_on: string;

  book_liner_id: string;
  book_liner_code: string;
  book_liner_name: string;

  book_no: string;
  book_mblno: string;

  book_agent_id: string;
  book_agent_code: string;
  book_agent_name: string;

  book_agent_br_id: string;
  book_agent_br_no: string;
  book_agent_br_addr: string;

  book_cha_id: string;
  book_cha_code: string;
  book_cha_name: string;

  book_exporter_id: string;
  book_exporter_code: string;
  book_exporter_name: string;

  book_factloc_id: string;
  book_factloc_code: string;
  book_factloc_name: string;

  book_consignee_id: string;
  book_consignee_code: string;
  book_consignee_name: string;

  book_nomination: string;

  book_commodity_id: string;
  book_commodity_code: string;
  book_commodity_name: string;

  book_description: string;
  book_total_container: number;

  book_pol_id: string;
  book_pol_code: string;
  book_pol_name: string;

  book_pod_id: string;
  book_pod_code: string;
  book_pod_name: string;

  book_pofd_id: string;
  book_pofd_code: string;
  book_pofd_name: string;

  book_cutoff_on: string;
  book_vsl_eta: string;
  book_etd: string;
  book_eta: string;
  book_pofd_eta: string;

  book_vessel_id: string;
  book_vessel_code: string;
  book_vessel_name: string;

  book_vessel_no: string;
  book_etd_confirm: boolean;
  book_eta_confirm: boolean;
  book_pofd_eta_confirm: boolean;

  book_terminal: string;

  book_salesman_id: string;
  book_salesman_code: string;
  book_salesman_name: string;

  book_status_id: string;
  book_stuffedat: string;

  book_coloader_id: string;
  book_coloader_code: string;
  book_coloader_name: string;
  book_cntr: string;

  book_nature: string;
  book_terms: string;
  book_shipment_type: string;

  book_by: string;
  book_sinos: string;
  book_teu: string;
  book_folder_no: string;
  book_folder_sent_date: string;

  book_m20: number;
  book_m40: number;
  book_mteu: number;
  book_mcbm: number;
  book_mdesc: string;

  book_shipper_name: string;
  book_ap_amt: number;
  book_ap_gst: number;
  book_ap_invnos: string;
  book_prealert_date: string;
  book_released_date: string;
  book_docs: number;

  book_edit_code: string;
  lock_record: boolean;

  book_agent2_id: string;
  book_agent2_code: string;
  book_agent2_name: string;

  book_por_id: string;
  book_por_code: string;
  book_por_name: string;
  book_por_etd: string;

  book_pofdc_id: string;
  book_pofdc_code: string;
  book_pofdc_name: string;
  book_pofdc_eta: string;
  book_move: string;

  rec_category: string;
  rec_mode: string;
  _globalvariables: GlobalVariables;

  HblList: Hblm[] = [];
  BkmCntrList: BkmCntrtype[] = [];
  BkmPayList: BkmPayment[] = [];
}

