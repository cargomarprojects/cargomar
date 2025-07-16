


import { GlobalVariables } from '../../core/models/globalvariables';

import { Ledgert } from './ledgert';
import { CostCentert } from './costcentert';
import { LedgerXref } from './ledgerxref';

export class Ledgerh {

  jvh_pkid: string;
  jvh_date: string;
  jvh_year: string;
  jvh_type: string;
  jvh_subtype: string;
  jvh_vrno: number;
  jvh_docno: string;

  jvh_posted: string;

  jvh_acc_id: string;
  jvh_acc_code: string;
  jvh_acc_name: string;

  jvh_acc_br_id: string;
  jvh_acc_br_slno: string;
  jvh_acc_br_address: string;
  jvh_acc_br_email: string;

  jvh_gst: boolean;

  jvh_gstin: string;

  jvh_rec_source: string;
  jvh_location: string;

  jvh_exwork: boolean;


  jvh_state_id: string;
  jvh_state_code: string;
  jvh_state_name: string;
  jvh_gst_type: string;

  jvh_invno: string;
  jvh_invdt: string;
  jvh_org_invno: string;
  jvh_org_invdt: string;

  jvh_cgst_amt: number;
  jvh_sgst_amt: number;
  jvh_igst_amt: number;
  jvh_gst_amt: number;

  jvh_rc: boolean;
  jvh_sez: boolean;

  jvh_is_export: boolean;

  jvh_igst_exception: boolean;


  jvh_no_brok: boolean;
  jvh_basic_frt: number;
  jvh_brok_per: number;
  jvh_brok_amt: number;
  jvh_brok_remarks: string;

  jvh_remarks: string;


  jvh_debit: number;
  jvh_credit: number;

  jvh_tot_famt: number;
  jvh_cgst_famt: number;
  jvh_sgst_famt: number;
  jvh_igst_famt: number;
  jvh_gst_famt: number;
  jvh_net_famt: number;

  jvh_tot_amt: number;
  jvh_net_amt: number;

  jvh_curr_id: string;
  jvh_curr_code: string;
  jvh_curr_name: string;

  jvh_exrate: number;
  jvh_reference: string;
  jvh_reference_date: string;
  jvh_narration: string;

  jvh_cc_category: string;
  jvh_cc_id: string;
  jvh_cc_code: string;
  jvh_cc_name: string;

  jvh_diff: number;

  jvh_drcr: string;

  jvh_edit_code: string;
  jvh_edit_date: string;
  jvh_banktype: string;

  jvh_brok_exrate: number;
  jvh_brok_amt_inr: number;

  jvh_docs: number;

  rec_mode: string;
  rec_category: string = '';
  rec_aprvd_status: string;
  rec_aprvd_remark: string;
  rec_aprvd: string;
  rec_aprvd_by: string;
  jvh_chq_printed: number;

  jvh_allocation_found: boolean;

  jvh_not_over_chq: boolean;
  jvh_update_chq: boolean;

  jvh_is_einv: string;
  jvh_einv_status: string;
  jvh_irn: string;

  jvh_source_id: string;
  jvh_company_add_slno: number;
  jvh_crdays: number;
  jvh_selected: boolean;
  jvh_lock_record: boolean;

  rec_created_by: string;
  rec_created_date: string;
  jvh_upload_files: string;

  _globalvariables: GlobalVariables;

  LedgerList: Ledgert[] = [];
  CostCenterList: CostCentert[] = [];
  XrefList: LedgerXref[] = [];
}
