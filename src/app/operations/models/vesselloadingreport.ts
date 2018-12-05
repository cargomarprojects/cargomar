import { GlobalVariables } from '../../core/models/globalvariables';

export class VesselLoadingReport {

  mbl_agent_name: string;
  mbl_vessel_name: string;
  mbl_vessel_voyage: string;
  book_cntr_no: string;
  book_cntr_grwt: number;
  book_cntr_grwt_unit: string;
  book_cntr_type: string;
  mbl_commodity: string;
  mbl_pofd_name: string;
  book_cntr_stuffed_at: string;
  book_cntr_stuffed_on: string;
  mbl_book_no: string;

  rec_mode: string;
  _globalvariables: GlobalVariables;
}

