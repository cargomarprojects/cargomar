
import { GlobalVariables } from '../../core/models/globalvariables';

export class BkTeu {

  cntr_pkid: string;
  cntr_no: string;
  cntr_type_code: string;
  cntr_booking_no: string; 
  cntr_clearing: string;
  mbl_no: string;
 
  mbl_pol_etd: string;
  mbl_shipment_type: string;
  mbl_nature: string;
  mbl_book_cntr_mcbm: number;
  mbl_book_cntr_m20: number;
  mbl_book_cntr_m40: number;
  mbl_book_cntr_mteu: number;

  hbl_pol: string;
  hbl_pod: string;
  hbl_pofd: string;
  hbl_agent: string;
  branch: string;

    _globalvariables: GlobalVariables;
}
