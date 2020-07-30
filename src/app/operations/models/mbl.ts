import { GlobalVariables } from '../../core/models/globalvariables';
import { Hblm } from '../../operations/models/hbl';
import { Trackingm } from './tracking';

export class Mblm {

  mbl_pkid: string;
  mbl_year: number;
  mbl_no: string;
  mbl_date: string;
  mbl_bookslno: number;
  mbl_book_no: string;

  mbl_agent_id: string;
  mbl_agent_code: string;
  mbl_agent_name: string;
  mbl_agent_br_id: string;
  mbl_agent_br_no: string;
  mbl_agent_br_addr: string;

  mbl_carrier_id: string;
  mbl_carrier_code: string;
  mbl_carrier_name: string;
  mbl_freight_status: string;
  mbl_released_date: string;
  mbl_coloading: string;
  mbl_direct_bl: string;
  mbl_grwt: number;
  mbl_chwt: number;

  mbl_chq_req_date: string;
  mbl_folder_sent_date: string;
  mbl_folder_no: string;

  mbl_exp_id: string;
  mbl_exp_code: string;
  mbl_exp_name: string;

  mbl_exp_br_id: string;
  mbl_exp_br_no: string;
  mbl_exp_br_addr: string;

  mbl_imp_id: string;
  mbl_imp_code: string;
  mbl_imp_name: string;

  mbl_imp_br_id: string;
  mbl_imp_br_no: string;
  mbl_imp_br_addr: string;

  mbl_cha_id: string;
  mbl_cha_code: string;
  mbl_cha_name: string;

  mbl_forwarder_id: string;
  mbl_forwarder_code: string;
  mbl_forwarder_name: string;


  mbl_factloc_id: string;
  mbl_factloc_code: string;
  mbl_factloc_name: string;
  mbl_status_id: string;

  mbl_nomination: string;

  mbl_commodity_id: string;
  mbl_commodity_code: string;
  mbl_commodity_name: string;

  mbl_description: string;


  mbl_pol_id: string;
  mbl_pol_code: string;
  mbl_pol_name: string;

  mbl_pod_id: string;
  mbl_pod_code: string;
  mbl_pod_name: string;

  mbl_pofd_id: string;
  mbl_pofd_code: string;
  mbl_pofd_name: string;
  mbl_flight_no: string;
  mbl_etd: string;
  mbl_eta: string;

  mbl_etd_confirm: boolean;
  mbl_eta_confirm: boolean;

  mbl_salesman_id: string;
  mbl_salesman_code: string;
  mbl_salesman_name: string;

  mbl_vessel_id: string;
  mbl_vessel_code: string;
  mbl_vessel_name: string;
  mbl_vessel_no: string;

  mbl_vessel_eta: string;
  mbl_pofd_eta: string;
  mbl_pofd_eta_confirm: boolean;

  mbl_igmno: string;
  mbl_igmdate: string;
  mbl_despatchdate: string;
  mbl_jobtype: string;

  mbl_ap_amt: number;
  mbl_ap_gst: number;
  mbl_ap_invnos: string;

  mbl_sinos: string;
  mbl_terms: string;
  mbl_origin_country_id: string;
  mbl_origin_country_code: string;
  mbl_origin_country_name: string;
  //mbl_released_date: string;
  mbl_beno: string;
  mbl_cntr: string;
  mbl_docs: number;

  mbl_deliv_date: string;
  mbl_pol_eta:string;
  mbl_pol_eta_confirm:boolean;
  mbl_deliv_date_confirm:boolean;

  lock_record: boolean;

  rec_mode: string;
  rec_category: string;
  rec_created_date: string;

  _globalvariables: GlobalVariables;
  HblList: Hblm[] = [];
  TransitList:Trackingm[] = [];
}

