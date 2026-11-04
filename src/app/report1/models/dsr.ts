import { GlobalVariables } from '../../core/models/globalvariables';
import { CustomReportD } from '../../shared/models/customreporth';
import { User } from '../../admin/models/user';
import { SearchTable } from '../../shared/models/searchtable';

export class Dsr {
  job_pkid: string = '';
  job_date: string = '';
  job_docno: string = '';
  job_invoice_nos: string = '';
  job_prefix: string = '';
  job_shipper: string = '';
  job_consignee: string = '';
  job_pol: string = '';
  job_pod: string = '';


  hbl_bl_no: string = '';
  mbl_bl_no: string = '';
  job_cbm: number = 0;
  job_pkg: number = 0;
  job_pcs: number = 0;
  job_ntwt: number = 0;
  job_grwt: number = 0;
  opr_sbill_no: string = '';
  opr_sbill_date: string = '';
  opr_cargo_received_on: string = '';
  forwarder_name: string = '';
  mbl_vessel_name: string = '';
  mbl_vessel_no: string = '';
  opr_stuffed_at: string = '';
  opr_stuffed_on: string = '';
  hbl_book_cntr: string = '';
  mbl_pol_etd: string = '';
  mbl_pofd_eta: string = '';
  job_type: string = '';


  job_cha_name: string = '';
  job_agent_name: string = '';
  job_pofd_name: string = '';
  salesman: string = '';
  opr_cleared_date: string = '';

  job_chwt: number = 0;
  hbl_date: string = '';
  hbl_invoice_nos: string = '';
  mbl_date: string = '';
  liner_name: string = '';

  mbl_grwt: number = 0;
  mbl_chwt: number = 0;
  mbl_folder_no: string = '';
  mbl_folder_sent_date: string = '';
  opr_drawback_slno: string = '';
  opr_drawback_date: string = '';
  opr_drawback_amt: number = 0;

  hbl_no: string = '';
  mbl_no: string = '';

  hbl_exporter_name: string = '';
  hbl_importer_name: string = '';
  hbl_agent_name: string = '';
  impj_edi_no: string = '';
  mbl_pol: string = '';
  mbl_pod: string = '';

  hbl_pkg: number = 0;
  hbl_cbm: number = 0;
  hbl_grwt: number = 0;
  hbl_chwt: number = 0;
  cha_name: string = '';
  hbl_pod_eta: string = '';
  impj_be_type: string = '';
  impj_docs_required: string = '';
  impj_edichklst_sent_on: string = '';
  hbl_beno: string = '';
  hbl_bedate: string = '';
  impj_status: string = '';
  impj_status_date: string = '';
  impj_cleared_on: string = '';
  hbl_remarks: string = '';
  impj_doc_recvd_date: string = '';
  impj_doc_send_date: string = '';
  impj_waybill_no: string = '';
  impj_waybill_date: string = '';

  impj_sbno: string = '';
  impj_sbdate: string = '';

  job_remarks: string = '';
  job_commodity: string = '';
  job_terms: string = '';
  job_nomination: string = '';
  job_status: string = '';
  job_sman: string = '';
  branch: string = '';

  opr_ep_rec_date: string = '';

  mbl_book_no: string = '';
  mbl_book_date: string = '';
  mbl_prealert_date: string = '';
  hbl_ar_invnos: string = '';
  job_nature: string = '';

  hbl_ar_invamt: number = 0;
  hbl_ar_gstamt: number = 0;

  job_liner_agent: string = '';
  job_cntr: string = '';
  job_cntr_teu: number = 0;

  mbl_vessel2_name: string = '';

  displayed: boolean = false;

  mbl_ap_invnos: string = '';
  mbl_ap_invamt: number = 0;
  mbl_pkid: string = '';

  hbl_shipper: string = '';
  hbl_consignee: string = '';
  hbl_notify: string = '';
  hbl_commodity: string = '';
  mbl_carrier: string = '';
  mbl_flight_no: string = '';
  mbl_pod_eta: string = '';
  mbl_status: string = '';
  hsn_code: string = '';
  hbl_cf_date: string = '';

  trans_shipment: string = '';
  pickup_location: string = '';
  pickup_date: string = '';
  incoterm: string = '';
  po_no: string = '';
  rec_created_date: string = '';

  _globalvariables: GlobalVariables;
}


export interface iDsrModel {
  tp_code: string ;
  selectedRowIndex: number;
  ErrorMessage: string;
  mode: string;
  pkid: string;
  format_type: string;
  filter_date_type: string;
  type_date: string;
  from_date: string;
  to_date: string;
  branch_name: string;
  branch_code: string;
  job_type: string;
  shipper_id: string;
  shipper_name: string;
  consignee_id: string;
  consignee_name: string;
  agent_id: string;
  agent_code: string;
  agent_name: string;
  carrier_id: string;
  carrier_code: string;
  carrier_name: string;
  pol_id: string;
  pol_code: string;
  pol_name: string;
  pod_id: string;
  pod_code: string;
  pod_name: string;
  sman_id: string;
  sman_code: string;
  sman_name: string;
  search_bookingrpt: boolean;
  bookingrpt: boolean;
  all: boolean;
  currentTab: string;
  searchstring: string;
  sSubject: string;
  sMsg: string;
  sHtml: string;
  sTo_ids: string;
  AttachList: any[];
  RecordList: Dsr[];
  Record: Dsr;
  feildList: CustomReportD[];
};

export const initialState: iDsrModel = {
  tp_code: '',
  selectedRowIndex: 0,
  ErrorMessage: '',
  mode: '',
  pkid: '',
  format_type: '',
  filter_date_type: 'JOB',
  type_date: '',
  from_date: '',
  to_date: '',
  branch_name: '',
  branch_code: '',
  job_type: '',
  shipper_id: '',
  shipper_name: '',
  consignee_id: '',
  consignee_name: '',
  agent_id: '',
  agent_code: '',
  agent_name: '',
  carrier_id: '',
  carrier_code: '',
  carrier_name: '',
  pol_id: '',
  pol_code: '',
  pol_name: '',
  pod_id: '',
  pod_code: '',
  pod_name: '',
  sman_id: '',
  sman_code: '',
  sman_name: '',
  search_bookingrpt: false,
  bookingrpt: false,
  all: false,
  currentTab: 'LIST',
  searchstring: '',
  sSubject: '',
  sMsg: '',
  sHtml: '',
  sTo_ids: '',
  AttachList: [],
  RecordList: [],
  Record: new Dsr,
  feildList: []
}