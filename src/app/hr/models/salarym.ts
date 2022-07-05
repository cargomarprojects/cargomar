
import { GlobalVariables } from '../../core/models/globalvariables';

export class Salarym {
  sal_pkid: string;
  sal_emp_id: string;
  sal_emp_code: string;
  sal_emp_name: string;
  sal_emp_bank_acno:string;
  sal_date: string;
  sal_month: number;
  sal_year: number;
  sal_fin_year: number;
  sal_days_worked: number;
  sal_emp_branch_group:number;
  a01: number;
  a02: number;
  a03: number;
  a04: number;
  a05: number;
  a06: number;
  a07: number;
  a08: number;
  a09: number;
  a10: number;
  a11: number;
  a12: number;
  a13: number;
  a14: number;
  a15: number;
  a16: number;
  a17: number;
  a18: number;
  a19: number;
  a20: number;
  a21: number;
  a22: number;
  a23: number;
  a24: number;
  a25: number;
  d01: number;
  d02: number;
  d03: number;
  d04: number;
  d05: number;
  d06: number;
  d07: number;
  d08: number;
  d09: number;
  d10: number;
  d11: number;
  d12: number;
  d13: number;
  d14: number;
  d15: number;
  d16: number;
  d17: number;
  d18: number;
  d19: number;
  d20: number;
  d21: number;
  d22: number;
  d23: number;
  d24: number;
  d25: number;
  sal_lop_amt: number;
  sal_gross_earn: number;
  sal_gross_deduct: number;
  sal_net: number;
  sal_basic_rt: number;
  sal_da_rt: number;
  sal_pf_mon_year: string;
  sal_pf_limit: number;
  sal_pf_cel_limit: number;
  sal_pf_cel_limit_amt: number;
  sal_pf_bal: number;
  sal_pf_wage_bal: number;
  sal_pf_base: number;
  sal_pf_emplr: number;
  sal_pf_emplr_share: number;
  sal_pf_emplr_pension: number;
  sal_pf_emplr_pension_per: number;
  sal_pf_eps_amt: number;
  sal_admin_per: number;
  sal_admin_amt: number;
  sal_admin_based_on: string;
  sal_edli_per: number;
  sal_edli_amt: number;
  sal_edli_based_on: string;
  sal_is_esi: boolean;
  sal_esi_base: number;
  sal_esi_emplr_per: number;
  sal_esi_limit: number;
  sal_esi_gov_share: number;
  sal_pay_date: string;
  sal_work_days: number;
  sal_mail_sent: boolean;
  sal_emp_grade: string;
  sal_emp_designation:string;
  sal_emp_do_joining: string;
  sal_selected: boolean;
  sal_esi_emply_per: number;
  sal_pf_per: number;
  sal_increment: number;
  sal_incentive: number;
  sal_tds_incentive: number;

  sal_sales_incentive: number;
  sal_tds_sales_incentive: number;


  sal_pl: number;
  sal_cl: number;
  sal_sl: number;
  sal_ot: number;
  sal_lp: number;
  
  sal_emp_status:string;
  sal_edit_code:string;
  rec_mode: string;
  rec_printed:boolean;
  rec_branch_code:string;
  _globalvariables: GlobalVariables;

  DetList: SalDet[] = [];
}

export class SalDet {
  e_code1: string;
  e_caption1: string;
  e_amt1: number;
  e_visible1: boolean;
  e_code2: string;
  e_caption2: string;
  e_amt2: number;
  e_visible2: boolean;
  d_code1: string;
  d_caption1: string;
  d_amt1: number;
  d_visible1: boolean;
  d_code2: string;
  d_caption2: string;
  d_amt2: number;
  d_visible2: boolean;
  a01_desc: string;
  a01_visible: boolean;
  a02_desc: string;
  a02_visible: boolean;
  a03_desc: string;
  a03_visible: boolean;
  a04_desc: string;
  a04_visible: boolean;
  a05_desc: string;
  a05_visible: boolean;
  a06_desc: string;
  a06_visible: boolean;
  a07_desc: string;
  a07_visible: boolean;
  a08_desc: string;
  a08_visible: boolean;
  a09_desc: string;
  a09_visible: boolean;
  a10_desc: string;
  a10_visible: boolean;
  a11_desc: string;
  a11_visible: boolean;
  a12_desc: string;
  a12_visible: boolean;
  a13_desc: string;
  a13_visible: boolean;
  a14_desc: string;
  a14_visible: boolean;
  a15_desc: string;
  a15_visible: boolean;
  a16_desc: string;
  a16_visible: boolean;
  a17_desc: string;
  a17_visible: boolean;
  a18_desc: string;
  a18_visible: boolean;
  a19_desc: string;
  a19_visible: boolean;
  a20_desc: string;
  a20_visible: boolean;
  a21_desc: string;
  a21_visible: boolean;
  a22_desc: string;
  a22_visible: boolean;
  a23_desc: string;
  a23_visible: boolean;
  a24_desc: string;
  a24_visible: boolean;
  a25_desc: string;
  a25_visible: boolean;
  d01_desc: string;
  d01_visible: boolean;
  d02_desc: string;
  d02_visible: boolean;
  d03_desc: string;
  d03_visible: boolean;
  d04_desc: string;
  d04_visible: boolean;
  d05_desc: string;
  d05_visible: boolean;
  d06_desc: string;
  d06_visible: boolean;
  d07_desc: string;
  d07_visible: boolean;
  d08_desc: string;
  d08_visible: boolean;
  d09_desc: string;
  d09_visible: boolean;
  d10_desc: string;
  d10_visible: boolean;
  d11_desc: string;
  d11_visible: boolean;
  d12_desc: string;
  d12_visible: boolean;
  d13_desc: string;
  d13_visible: boolean;
  d14_desc: string;
  d14_visible: boolean;
  d15_desc: string;
  d15_visible: boolean;
  d16_desc: string;
  d16_visible: boolean;
  d17_desc: string;
  d17_visible: boolean;
  d18_desc: string;
  d18_visible: boolean;
  d19_desc: string;
  d19_visible: boolean;
  d20_desc: string;
  d20_visible: boolean;
  d21_desc: string;
  d21_visible: boolean;
  d22_desc: string;
  d22_visible: boolean;
  d23_desc: string;
  d23_visible: boolean;
  d24_desc: string;
  d24_visible: boolean;
  d25_desc: string;
  d25_visible: boolean;

}
