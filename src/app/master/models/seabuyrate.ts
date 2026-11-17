
import { GlobalVariables } from '../../core/models/globalvariables';

export class SeaBuyRate {
  sbr_pkid: string;
  sbr_pol_id: string;
  sbr_pol_code: string;
  sbr_pod_id: string;
  sbr_pod_code: string;
  sbr_tradelane_id: string;
  sbr_tradelane_code: string;
  sbr_carrier_id: string;
  sbr_carrier_code: string;
  sbr_valid_from: string;
  sbr_valid_to: string;
  sbr_transit: string;
  sbr_pol_name: string;
  sbr_pod_name: string;
  sbr_carrier_name: string;
  sbr_tradelane_name: string;
  sbr_routing: string;
  sbr_remarks: string;
  sbr_frequency: string;
  sbr_vsl_cutoff: string;
  sbr_sail_day: string;
  sbr_country_name: string;
  sbr_20: number;
  sbr_40: number;
  sbr_40hc: number;
  sbr_20_baf: number;
  sbr_20_caf: number;
  sbr_20_ddc: number;
  sbr_20_pss: number;
  sbr_20_ebf: number;
  sbr_20_chassis: number;
  sbr_20_suez: number;
  sbr_20_piracy: number;
  sbr_20_ihc: number;
  sbr_20_ifs: number;
  sbr_20_other: number;
  sbr_20_acd: number;
  sbr_20_isps: number;
  sbr_40_baf: number;
  sbr_40_caf: number;
  sbr_40_ddc: number;
  sbr_40_pss: number;
  sbr_40_ebf: number;
  sbr_40_chassis: number;
  sbr_40_suez: number;
  sbr_40_piracy: number;
  sbr_40_ihc: number;
  sbr_40_ifs: number;
  sbr_40_other: number;
  sbr_40_acd: number;
  sbr_40_isps: number;
  sbr_40hc_baf: number;
  sbr_40hc_caf: number;
  sbr_40hc_ddc: number;
  sbr_40hc_pss: number;
  sbr_40hc_ebf: number;
  sbr_40hc_chassis: number;
  sbr_40hc_suez: number;
  sbr_40hc_piracy: number;
  sbr_40hc_ihc: number;
  sbr_40hc_ifs: number;
  sbr_40hc_other: number;
  sbr_40hc_acd: number;
  sbr_40hc_isps: number;
  sbr_20_tot: number;
  sbr_40_tot: number;
  sbr_40hc_tot: number;
  sbr_20_allin: number;
  sbr_40_allin: number;
  sbr_40hc_allin: number;
  sbr_version: number;
  sbr_gst_rate: number;
  sbr_terms: string;
  sbr_cntr_type: string;
  rec_branch_code: string;
  sbr_dest_freetime: string;

  rec_mode: string;
  _globalvariables: GlobalVariables;

}

export interface iSeaBuyRateModel {
  // filter Values
  Initialized: boolean;
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  list_format: string;
  currentTab: string;
  RecordList: SeaBuyRate[];

  InfoMessage: string;
  ErrorMessage: string;

  //Search Values
  fromdate: string;
  todate: string;
  search_validdate: string;
  search_tradelane_id: string;
  search_tradelane: string;
  search_pol_id: string;
  search_pol: string;
  search_pod_id: string;
  search_pod: string;
  search_liner_id: string;
  search_liner: string;
  sort_by: string;
  print_format: string;
  search_branch_code: string;
  allbr: boolean;

  // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iSeaBuyRateModel = {
  Initialized: false,
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  list_format: '',
  currentTab: 'LIST',
  RecordList: [],
  
  InfoMessage: '',
  ErrorMessage: '',

  fromdate: '',
  todate: '',
  search_validdate: '',
  search_tradelane_id: '',
  search_tradelane: '',
  search_pol_id: '',
  search_pol: '',
  search_pod_id: '',
  search_pod: '',
  search_liner_id: '',
  search_liner: '',
  sort_by: '',
  print_format: '',
  search_branch_code: '',
  allbr: false,

  page_count: 0,
  page_current: 0,
  page_rows: 30,
  page_rowcount: 0
}