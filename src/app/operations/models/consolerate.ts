
import { GlobalVariables } from '../../core/models/globalvariables';

export class Consolerate {
  cr_pkid: string;
  cr_agent_name: string;
  cr_branch_name: string;
  cr_branch_code: string;
  cr_cntr_type: string;

  cr_ex_rate_gbp: number;
  cr_org_inc_thc: number;
  cr_org_inc_bl: number;
  cr_org_exp_thc: number;
  cr_org_exp_emtyplce: number;
  cr_org_exp_misc: number;
  cr_org_exp_stuff: number;
  cr_org_exp_trans: number;
  cr_org_exp_cfs: number;
  cr_org_exp_survey: number;
  cr_org_exp_cseal: number;
  cr_org_exp_surrend: number;


  cr_des_inc_thc: number;
  cr_des_inc_hndg_cbm: number;
  cr_des_inc_hndg_ton: number;
  cr_des_inc_bl: number;

  cr_des_exp_terml: number;
  cr_des_exp_bl: number;
  cr_des_exp_shunt: number;
  cr_des_exp_unpack: number;
  cr_des_exp_lolo: number;
  cr_des_exp_securty: number;
  cr_des_exp_isps: number;
  cr_des_exp_tpw: number;
  cr_des_exp_tdoc: number;

  cr_rate_code: string;
  cr_rate_value: number;
  min_rate: boolean;

  rec_mode: string;
  rec_category: string;
  _globalvariables: GlobalVariables;

}

