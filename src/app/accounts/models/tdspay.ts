
import { GlobalVariables } from '../../core/models/globalvariables';

export class TdsPay {

  row_type: string;
  row_colour: string;

  acc_code: string;
  jvh_date: string;
  jvh_type: string;
  jvh_vrno: string;

  panno: string;
  party_name: string;
  location: string;
  pan_type: string;


  jv_tds_gross_amt: number;
  jv_tds_rate: number;
  divident: number;
  interest: number;
  commision: number;
  contract: number;
  rent: number;
  building: number;
  salary: number;
  forgnpay: number;
  ptax: number;
  jv_credit: number;
  rec_branch_code: string;

  _globalvariables: GlobalVariables;

}
