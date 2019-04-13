
import { GlobalVariables } from '../../core/models/globalvariables';

export class Costingm {
  cost_pkid: string;
  cost_cfno: number;
  cost_refno: string;
  cost_folderno: string;
  cost_mblid: string;
  cost_mblno: string;
  cost_sob_date: string;
  cost_agent_id: string;
  cost_agent_code: string;
  cost_agent_name: string;
  cost_year: number;
  cost_date: string;
  cost_folder_recdon: string;
  cost_currency_id: string;
  cost_currency_code: string;
  cost_currency_name: string;
  cost_format: string;
  cost_exrate: number;
  cost_rebate: number;
  cost_ex_works: number;
  cost_dest_charges: number;
  cost_hand_charges: number;
  cost_kamai: number;
  cost_dramt: number;
  cost_cramt: number;
  cost_dramt_fc: number;
  cost_cramt_fc: number;
  cost_buy_pp: number;
  cost_buy_cc: number;
  cost_sell_pp: number;
  cost_sell_cc: number;
  cost_buy_tot: number;
  cost_sell_tot: number;
  cost_other_charges: number;
  cost_asper_amount: number;
  cost_expense: number;
  cost_income: number;
  cost_profit: number;
  cost_our_profit: number;
  cost_your_profit: number;
  cost_drcr_amount: number;
  cost_drcr_amount_inr: number;
  cost_edit_code: string;
  cost_inform_rate: number;
  cost_sell_chwt: number;
  cost_type: string;
  cost_source: string;
  cost_book_cntr: string;
  cost_remarks: string;
  cost_drcr: string;
  cost_category: string;

  cost_agent_br_id: string;
  cost_agent_br_no: string;
  cost_agent_br_addr: string;

  cost_jv_agent_id: string;
  cost_jv_agent_code: string;
  cost_jv_agent_name: string;

  cost_jv_agent_br_id: string;
  cost_jv_agent_br_no: string;
  cost_jv_agent_br_addr: string;


  cost_jv_posted: boolean;
  cost_jv_ho_id: string;
  cost_jv_br_id: string;
  cost_jv_br_inv_id: string;

  cost_checked_on: string;
  cost_sent_on: string;
  cost_tot_acc_amt: number;

  cost_ex_rate_gbp: number;
  cost_org_inc_thc: number;
  cost_org_inc_bl: number;
  cost_org_exp_thc: number;
  cost_org_exp_emtyplce: number;
  cost_org_exp_misc: number;
  cost_org_exp_stuff: number;
  cost_org_exp_trans: number;
  cost_org_exp_surrend: number;
  cost_des_inc_thc: number;
  cost_des_inc_bl: number;
  cost_des_exp_terml: number;
  cost_des_exp_bl: number;
  cost_des_exp_shunt: number;
  cost_des_exp_unpack: number;
  cost_des_exp_lolo: number;
  cost_des_exp_securty: number;
  cost_des_inc_hndg_ton: number;
  cost_org_exp_cfs: number;
  cost_org_exp_survey: number;
  cost_org_exp_cseal: number;
  cost_des_exp_isps: number;
  cost_des_exp_tpw: number;
  cost_des_exp_tdoc: number;
  cost_des_inc_hndg_cbm: number;
  cost_ddp: boolean;

  rec_mode: string;
  rec_category: string;
  _globalvariables: GlobalVariables;
  DetailList: Costingd[] = [];
  DetailList2: Costingd[] = [];
}

export class Costingd {

  costd_pkid: string;
  costd_parent_id: string;
  costd_acc_id: string;
  costd_acc_name: string;
  costd_acc_amt: number;
  costd_type: string;
  costd_sino: string;
  costd_blno: string;
  costd_grwt: number;
  costd_chwt: number;
  costd_cbm: number;
  costd_actual_cbm: number;
  costd_frt_pp: number;
  costd_frt_cc: number;
  costd_frt_rate_pp: number;
  costd_frt_rate_cc: number;
  costd_wrs_pp: number;
  costd_wrs_cc: number;
  costd_wrs_rate_pp: number;
  costd_wrs_rate_cc: number;
  costd_myc_pp: number;
  costd_myc_cc: number;
  costd_myc_rate_pp: number;
  costd_myc_rate_cc: number;
  costd_mcc_pp: number;
  costd_mcc_cc: number;
  costd_mcc_rate_pp: number;
  costd_mcc_rate_cc: number;
  costd_src_pp: number;
  costd_src_cc: number;
  costd_src_rate_pp: number;
  costd_src_rate_cc: number;
  costd_oth_pp: number;
  costd_oth_cc: number;
  costd_oth_rate_pp: number;
  costd_oth_rate_cc: number;
  costd_pp: number;
  costd_cc: number;
  costd_tot: number;
  costd_ctr: number;

  cost_jv_ho_vrno: string;
  cost_jv_br_vrno: string;
  cost_jv_br_invno: string;
  cost_jv_posted: boolean;

  costd_category: string;

  costd_acc_qty: number;
  costd_acc_rate: number;
  costd_shipper_name: string;
  costd_consignee_name: string;
  costd_hbl_terms: string;
  costd_hbl_nomination: string;
  costd_pofd_name: string;
  costd_consignee_group: string;

  costd_rebate: number;
  costd_amenment_chrgs: number;
  costd_acd_rate_pp: number;
  costd_acd_rate_cc: number;
  costd_acd_pp: number;
  costd_acd_cc: number;
  costd_ddc_rate_pp: number;
  costd_ddc_rate_cc: number;
  costd_ddc_pp: number;
  costd_ddc_cc: number;
  costd_incentive_rate: number;
  costd_fh_limit1: number;
  costd_fh_rate1: number;
  costd_fh_limit2: number;
  costd_fh_rate2: number;
  costd_fh_limit3: number;
  costd_fh_rate3: number;
  costd_fh_chrg_perhouse: number;
  costd_oth_chrgs_ritra: number;
  costd_ex_chrg_ritrahouse: number;
  costd_spl_incentive_rate: number;
  costd_house_notinclude: boolean;
  costd_incentive_notreceived: boolean;
  costd_seal_chrgs: number;
  costd_baf_rate_pp: number;
  costd_baf_rate_cc: number;
  costd_baf_pp: number;
  costd_baf_cc: number;
  costd_caf_rate_pp: number;
  costd_caf_rate_cc: number;
  costd_caf_pp: number;
  costd_caf_cc: number;

  costd_haulage_per_cbm: number;
  costd_haulage_min_rate: number;
  costd_haulage_wt_divider: number;
  costd_destuff_pd: number;
  costd_handling_fee: number;
  costd_truck_cost: number;
  costd_cntr_shifit: number;
  costd_vessel_chrgs: number;
  costd_ex_works: number;

  costd_agent_format: string;
  costd_remarks: string;

  costd_srate: number;
  costd_brate: number;
  costd_split: number;
}
