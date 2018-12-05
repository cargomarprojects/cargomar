
import { GlobalVariables } from '../../core/models/globalvariables';

import { Ledgert } from './ledgert';
import { CostCentert } from './costcentert';
import { LedgerXref } from './ledgerxref';

export class OpLedger {

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

  jvh_group_name: string;
  jvh_type_name: string;

  jvh_rec_source: string;

  jvh_debit: number;
  jvh_credit: number;



  jvh_tot_amt: number;
  jvh_net_amt: number;

  jvh_curr_id: string;
  jvh_curr_code: string;
  jvh_curr_name: string;

  jvh_exrate: number;
  jvh_reference: string;
  jvh_reference_date: string;
  jvh_narration: string;
  jvh_location: string;

  jvh_cc_category: string;


  jvh_diff: number;

  jvh_drcr: string;

  jvh_ftotal: number;
  jvh_total: number;
  jvh_bank: string;
  jvh_branch: string;
  jvh_chqno: number;
  jvh_due_date: string;
  jvh_remarks: string;

  jvh_edit_code: string;
  jvh_edit_date: string;

  rec_mode: string;

  rec_category: string;

  jvh_allocation_found: boolean;

  _globalvariables: GlobalVariables;



}
