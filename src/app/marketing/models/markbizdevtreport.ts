import { GlobalVariables } from "../../core/models/globalvariables";
export class BizdevelopReport {
  user_id: string;
  user_name: string;
  shipper_tot: number;
  c_shipper_tot: number;
  consignee_tot: number;
  agent_tot: number;
  carrier_tot: number;
  buyingagent_tot: number;
  total: number;
  _globalvariables: GlobalVariables;
}

export interface iBizdevelopReportModel {
  // filter Values
  selectedRowIndex: number;
  mode: string;
  pkid: string;
  list_format: string;
  currentTab: string;
  RecordList: BizdevelopReport[];

  ErrorMessage: string;

  searchDateType: string;
  from_date: string;
  to_date: string;
  bCoreTeam: Boolean;

    // Page Values
  page_count: number;
  page_current: number;
  page_rows: number;
  page_rowcount: number;
};

export const initialState: iBizdevelopReportModel = {
  selectedRowIndex: 0,
  mode: '',
  pkid: '',
  list_format: '',
  currentTab: '',
  RecordList: [],
  
  ErrorMessage: '',

  searchDateType: '',
  from_date: '',
  to_date: '',
  bCoreTeam: true,

  page_count: 0,
  page_current: 0,
  page_rows: 15,
  page_rowcount: 0
}