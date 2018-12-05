
export class ReconReport {
  rowtype: string;
  rowcolor: string;
  level1: string;
  level2: string;
  recon_acc_main_code: string;
  recon_acc_code: string;
  recon_acc_name: string;
  recon_grp_name: string;
  recon_acc_pkid: string;
  recon_cc_code: string;
  recon_cc_name: string;
  recon_cc_category: string;
  recon_cc_remarks: string;
  recon_type: string;
  recon_chqno: string;
  recon_due_date: string;
  recon_date: string;
  recon_display_date: string;

  recon_paid_to: string;
  recon_bank: string;

  pkid: string;
  opdebit: number;
  opcredit: number;
  debit: number;
  credit: number;
  drbal: number;
  crbal: number;
  advance: number;


  crdays: number;
  crlimit: number;
  osdays: number;
  overduedays: number;

  jvh_not_over_chq: string;

  rowdisplayed: boolean;
}
