
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

  jv_tds_gross_amt: number;
  jv_tds_rate: number;
  interest: number;
  commision: number;
  contract: number;
  rent: number;
  building: number;
  salary: number;
  forgnpay: number;
  ptax: number;
  jv_credit: number;
  
 

    _globalvariables: GlobalVariables;

}
