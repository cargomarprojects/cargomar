
import { GlobalVariables } from '../../core/models/globalvariables';

export class sal_incentivem {
  salh_pkid : string;
  salh_date : string;
  salh_fin_year : number;
  salh_due_months : string;
  salh_incentive_type_id : string;
  salh_incentive_type_name : string;
  salh_arearsnos : number;
  rec_mode: string;
  rec_company_code : string ;
  rec_branch_code : string ;
  rec_created_by : string ;
  rec_created_date : string ;

  IncentiveList : sal_incentived [] = [];
  _globalvariables: GlobalVariables;
}

export class sal_incentived {
  sald_pkid : string;
  sald_emp_id : string;
  sald_emp_code : string;
  sald_emp_name : string;
  sald_arears_amt  : number;
  sald_incentive_amt   : number;
  sald_allow_amt   : number;
  sald_ded_amt   : number;
  sald_tds_amt   : number;
  sald_gross_amt   : number;
  sald_total_ded   : number;
  sald_net_amt   : number;
}