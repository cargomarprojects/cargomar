
import { GlobalVariables } from '../../core/models/globalvariables';

export class BillWise {

  row_type: string;
  row_colour: string;


  jvh_date: string;
  jvh_vrno: string;
  jvh_type: string;
  jvh_sez: string;
  acc_name: string;

  jvh_gstin: string;

  jvh_rc: string;

  jvh_gst_type: string;
  jvh_cc_category: string;
  hbl_no: string;


  jvh_tot_amt: number;
  jvh_cgst_amt: number;
  jvh_sgst_amt: number;
  jvh_igst_amt: number;
  jvh_gst_amt: number;
  jvh_net_amt: number;


  jvh_docno: string;
  consignee: string;
  pod: string;
  volume: string;

  hbl_ntwt: number;
  hbl_grwt: number;
  jv_frt: number;
  jv_frt_gst: number;
  jv_thc: number;
  jv_thc_gst: number;
  jv_detn: number;
  jv_detn_gst: number;
  jv_others: number;
  jv_others_gst: number;
  total_gst: number;

  job_docno: string;
  jexp_invoice_no: string;
  jexp_comm_invoice_no: string;
  volum: number;

  branch: string;
  
  _globalvariables: GlobalVariables;

}
