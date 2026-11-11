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

export interface iVesselLoadingReportModel {
  // filter Values
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  list_format: string;
  currentTab: string;
  RecordList: VesselLoadingReport[];

  ErrorMessage: string;

  //Search Values
  searchcarrierid: string;
  searchcarrier_name: string;
  searchvesselid: string;
  searchvessel_name: string;
  searchvoyage: string;

  // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};
export const initialState: iVesselLoadingReportModel = {
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  list_format: '',
  currentTab: '',
  RecordList: [],
  
  ErrorMessage: '',

  searchcarrierid: '',
  searchcarrier_name: '',
  searchvesselid: '',
  searchvessel_name: '',
  searchvoyage: '',

  page_count: 0,
  page_current: 0,
  page_rows: 15,
  page_rowcount: 0
}

