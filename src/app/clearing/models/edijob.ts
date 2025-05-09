import { GlobalVariables } from '../../core/models/globalvariables';

export class EdiJob {
  pkid: string;
  file_id: string;
  source_table: string;
  job_slno: string;
  job_ref_no: string;
  job_ref_date: string;
  job_docno: string;
  shipper_name: string;
  shipper_branch_slno: string;
  shipper_address: string;
  billed_to: string;
  consignee_name: string;
  consignee_address: string;
  consignee_zip_code: string;
  buyersameasconsignee: string;
  buyer_name: string;
  buyer_address: string;
  buyer_zip_code: string;
  origin_country: string;
  origin_state: string;
  load_port: string;
  discharge_port: string;
  destination_port: string;
  commodity: string;
  cargo_movement: string;
  freight_terms: string;
  cargo_nature: string;
  total_pkgs: string;
  pkgs_unit: string;
  loose_pkgs: string;
  nt_wt: string;
  gr_wt: string;
  ch_wt: string;
  wt_unit: string;
  cbm: string;
  rbi_waiver_no: string;
  rbi_waiver_date: string;
  bank_name: string;
  ac_number: string;
  forex_ac_number: string;
  ad_code: string;
  nfei: string;
  job_selected: boolean;
  processed: string;
  invoice_nos: string;
  invoice_dt: string;
  invoice_count: string;
  remarks: string;
  file_format: string;

  msg_from_id: string;
  msg_to_id: string;
  msg_subject: string;
  msg_date: string;

  job_type: string;
  transport_mode: string;
  place_of_receipt: string;
  pre_carriage: string;
  discharge_country: string;
  destination_country: string;
  stuffed_at: string;
  total_containers: string;
  sb_remarks: string;
  shipping_bill_no: string;
  shipping_bill_date: string;
  isconsbuyersame: boolean;
  rec_branch_code: string;

  PackingList: EdiJobPacking[] = [];
  rec_mode: string;
  _globalvariables: GlobalVariables;
}

export class EdiJobPacking {
  pkid: string;
  pack_slno: string;
  pack_from: string;
  pack_to: string;
  pack_unit: string;

  rec_mode: string;
  _globalvariables: GlobalVariables;
}

