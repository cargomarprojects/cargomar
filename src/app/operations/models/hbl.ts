import { GlobalVariables } from '../../core/models/globalvariables';
import { Jobm } from '../../operations/models/job';

export class Hblm {

  hbl_pkid: string;
  hbl_year: number;
  hbl_no: number;
  hbl_date: string;
  hbl_sidate: string;
  hbl_bl_no: string;

  hbl_exp_id: string;
  hbl_exp_code: string;
  hbl_exp_name: string;

  hbl_exp_br_id: string;
  hbl_exp_br_no: string;
  hbl_exp_br_addr: string;


  hbl_agent_id: string;
  hbl_agent_code: string;
  hbl_agent_name: string;

  hbl_agent_br_id: string;
  hbl_agent_br_no: string;
  hbl_agent_br_addr: string;

  hbl_carrier_id: string;
  hbl_carrier_code: string;
  hbl_carrier_name: string;


  hbl_imp_id: string;
  hbl_imp_code: string;
  hbl_imp_name: string;

  hbl_imp_br_id: string;
  hbl_imp_br_no: string;
  hbl_imp_br_addr: string;


  hbl_billto_id: string;
  hbl_billto_code: string;
  hbl_billto_name: string;  


  hbl_houseno: string;
  hbl_selected: boolean;

  hbl_nature: string;
  hbl_terms: string;
  hbl_coloading: string;
  hbl_acd_status: string;
  hbl_switch_bl: string;
  hbl_location_id: string;
  hbl_location_code: string;
  hbl_location_name: string;
  hbl_sample: string;
  hbl_ddp: string;
  hbl_ddu: string;
  hbl_ex_works: string;
  hbl_profit: number;
  hbl_salesman_id: string;
  hbl_salesman_code: string;
  hbl_salesman_name: string;
  hbl_remarks: string;
  hbl_direct_bl: string;

  hbl_mbl_id: string;
  hbl_mbl_no: string;
  hbl_mbl_bookslno: string;
  hbl_mbl_bookno: string;

  hbl_beno: string;
  hbl_bedate: string;
  hbl_inwarddate: string;

  hbl_pol_id: string;
  hbl_pol_code: string;
  hbl_pol_name: string;

  hbl_origin_country_id: string;
  hbl_origin_country_code: string;
  hbl_origin_country_name: string;

  hbl_carton_nos: string;
  hbl_pkg: number;
  hbl_pkg_unit_id: string;
  hbl_pkg_unit_code: string;
  hbl_pkg_unit_name: string;
  hbl_pcs: number;
  hbl_ntwt: number;
  hbl_ntwt_unit_id: string;
  hbl_ntwt_unit_code: string;
  hbl_ntwt_unit_name: string;
  hbl_grwt: number;
  hbl_grwt_unit_id: string;
  hbl_grwt_unit_code: string;
  hbl_grwt_unit_name: string;
  hbl_cbm: number;
  hbl_chwt: number;

  hbl_deliv_orderissued: string;
  hbl_deliv_place: string;
  hbl_deliv_date: string;
  hbl_frt_amt: number;
  hbl_frt_curr_id: string;
  hbl_frt_curr_code: string;
  hbl_frt_curr_name: string;
  hbl_frt_ex_rate: number;
  hbl_insu_amt: number;
  hbl_insu_curr_id: string;
  hbl_insu_curr_code: string;
  hbl_insu_curr_name: string;
  hbl_insu_ex_rate: number;
  hbl_nomination: string;
  hbl_invoice_nos: string;
  hbl_job_nos: string;

  hbl_ar_amt: number;
  hbl_ar_gst: number;
  hbl_ar_invnos: string;
  hbl_ddc_status: string;
  hbl_commodity: string;

  hbl_coloader_id: string;
  hbl_coloader_code: string;
  hbl_coloader_name: string;
  hbl_fcr_no: string;
  hbl_book_cntr: string;
  hbl_released_date: string;

  lock_record: boolean;
  rec_mode: string;
  rec_category: string;

  hbl_exp_br_addr1: string;
  hbl_exp_br_addr2: string;
  hbl_exp_br_addr3: string;
  hbl_exp_br_tel: string;
  hbl_exp_br_email: string;
  hbl_imp_br_addr1: string;
  hbl_imp_br_addr2: string;
  hbl_imp_br_addr3: string;
  hbl_imp_br_tel: string;
  hbl_imp_br_email: string;
  hbl_rebate_amt_inr: number;

  hbl_buy_remarks:string;
  hbl_sell_remarks:string;
  hbl_cf_date: string;
  
  hbl_unlockid : string;
  hbl_book_slno: number;

  _globalvariables: GlobalVariables;

  JobList: Jobm[] = [];
}

