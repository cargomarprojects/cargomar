
import { GlobalVariables } from '../../core/models/globalvariables';
export class MarkSalesVolume {
    sv_pkid: string;
    sv_mode: string;
    sv_type: string;
    sv_cust_id: string;
    sv_cust_code: string;
    sv_cust_name: string;
    sv_cust_is_new: string;
    sv_cntr_20: number;
    sv_cntr_40: number;
    sv_cntr_lcl: number;
    sv_teus: number;
    sv_kgs: number;
    sv_sb: number;
    sv_be: number;
    sv_pol_id: string;
    sv_pol_code: string;
    sv_pol_name: string;
    sv_pod_id: string;
    sv_pod_code: string;
    sv_pod_name: string;
    sv_counterpart_id: string;
    sv_counterpart_code: string;
    sv_counterpart_name: string;
    sv_commodity: string;
    sv_week_no: number;
    sv_date:string;
    
    rec_mode: string;
    rec_created_by:string;
    rec_created_date:string;


    _globalvariables: GlobalVariables;
}

export interface iMarkSalesVolumeModel {
  // filter Values
  Initialized: boolean;
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  list_format: string;
  currentTab: string;
  RecordList: MarkSalesVolume[];

  InfoMessage: string;
  ErrorMessage: string;

  searchstring: string;

  // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iMarkSalesVolumeModel = {
  Initialized: false,
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  list_format: '',
  currentTab: 'LIST',
  RecordList: [],

  InfoMessage: '',
  ErrorMessage: '',

  searchstring: '',

  page_count: 0,
  page_current: 0,
  page_rows: 25,
  page_rowcount: 0
}
