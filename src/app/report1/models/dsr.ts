
import { GlobalVariables } from '../../core/models/globalvariables';

export class Dsr {
  job_pkid: string;
  job_date: string;
  job_docno: string;
  job_invoice_nos: string;
  job_prefix: string;
  job_shipper: string;
  job_consignee: string;
  job_pol: string;
  job_pod: string;


  hbl_bl_no: string;
  mbl_bl_no: string;
  job_cbm: number;
  job_pkg: number;
  job_pcs: number;
  job_ntwt: number;
  job_grwt: number;
  opr_sbill_no: string;
  opr_sbill_date: string;
  opr_cargo_received_on: string;
  forwarder_name: string;
  mbl_vessel_name: string;
  mbl_vessel_no: string;
  opr_stuffed_at: string;
  opr_stuffed_on: string;
  hbl_book_cntr: string;
  mbl_pol_etd: string;
  mbl_pofd_eta: string
  job_type: string;


  job_cha_name: string;
  job_agent_name: string;
  job_pofd_name: string;
  salesman: string;
  opr_cleared_date: string;

  job_chwt: number;
  hbl_date: string;
  hbl_invoice_nos: string;
  mbl_date: string;
  liner_name: string;

  mbl_grwt: number;
  mbl_chwt: number;
  mbl_folder_no: string;
  mbl_folder_sent_date: string;
  opr_drawback_slno: string;
  opr_drawback_date: string;
  opr_drawback_amt: number;

  hbl_no: string;
  mbl_no: string;

  hbl_exporter_name: string;
  hbl_importer_name: string;
  hbl_agent_name: string;
  impj_edi_no: string;
  mbl_pol: string;
  mbl_pod: string;

  hbl_pkg: number;
  hbl_cbm: number;
  hbl_grwt: number;
  hbl_chwt: number;
  cha_name: string;
  hbl_pod_eta: string;
  impj_be_type: string;
  impj_docs_required: string;
  impj_edichklst_sent_on: string;
  hbl_beno: string;
  hbl_bedate: string;
  impj_status: string;
  impj_status_date: string;
  impj_cleared_on: string;
  hbl_remarks: string;
  impj_doc_recvd_date: string;
  impj_doc_send_date: string;
  impj_waybill_no: string;
  impj_waybill_date: string;

  impj_sbno: string;
  impj_sbdate: string;

  job_remarks: string;
  job_commodity: string;
  job_terms: string;
  job_nomination: string;
  job_status: string;
  job_sman: string;
  branch: string;

  opr_ep_rec_date: string;

  mbl_book_no: string;
  mbl_book_date: string;
  mbl_prealert_date: string;
  hbl_ar_invnos: string;
  job_nature: string;

  hbl_ar_invamt: number;
  hbl_ar_gstamt: number;

  job_liner_agent: string;
  job_cntr: string;
  job_cntr_teu: number;

  mbl_vessel2_name: string;

  displayed: boolean;

  mbl_ap_invnos: string;
  mbl_ap_invamt: number;
  mbl_pkid: string;

  hbl_shipper: string;
  hbl_consignee: string;
  hbl_notify: string;
  hbl_commodity: string;
  mbl_carrier: string;
  mbl_flight_no: string;
  mbl_pod_eta: string;
  mbl_status: string;
  hsn_code: string;
  hbl_cf_date: string;

  trans_shipment: string;
  pickup_location: string;
  pickup_date: string;
  incoterm: string;
  po_no: string;
  rec_created_date: string;
  
  _globalvariables: GlobalVariables;
}
