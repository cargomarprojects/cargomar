
import { GlobalVariables } from '../../core/models/globalvariables';
import { Gstr2bDownload } from '../models/gstr2bdownload';

export class GstReport {

  row_type: string;
  row_colour: string;
  jvh_pkid: string;
  jvh_docno: string;
  jvh_cc_category: string;
  jvh_date: string;
  jvh_gstin: string;
  jvh_reference: string;
  jvh_reference_date: string;
  jvh_org_invno: string;
  jvh_org_invdt: string;
  jvh_net_amt: number;
  jvh_tot_amt: number;
  jv_credit: number;
  jv_net_total: number;
  jv_taxable_amt: number;
  jvh_gst_type: string;
  jv_gst_rate: number;
  jv_gst_amt: number;
  jv_cgst_amt: number;
  jv_sgst_amt: number;
  jv_igst_amt: number;
  jv_cgst_rate: number;
  jv_sgst_rate: number;
  jv_igst_rate: number;
  jvh_sez: string;
  jvh_state_code: string;
  jvh_state_name: string;
  rc: string;
  jvh_invoice_type: string;
  ecomgstn: string;
  cess: number;
  jvh_gst: string;
  jvh_party_name: string;
  jv_sac_code: string;
  jv_acc_code: string;
  jv_acc_name: string;

  inv_amt: number;
  taxable_amt: number;
  branch: string;
  gstr2b_row_type: string;

  ack_no: string;
  ack_date: string;
  jvh_einv_status: string;
  jvh_beinv_status: boolean;
  row_displayed: boolean;
  
  gstr2b_List: Gstr2bDownload[] = [];
  _globalvariables: GlobalVariables;
}
