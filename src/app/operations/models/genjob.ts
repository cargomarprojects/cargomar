import { GlobalVariables } from '../../core/models/globalvariables';

export class GenJobm {
  gj_pkid: string;
  gj_job_prefix: string;
  gj_job_date: string;

  gj_shipper_id: string;
  gj_shipper_code: string;
  gj_shipper_name: string;

  gj_shipper_br_id: string;
  gj_shipper_br_no: string;
  gj_shipper_br_addr: string;

  gj_shipper_inv_no: string;
  gj_licence_no: string;
  gj_status: string;

  gj_pol_id: string;
  gj_pol_code: string;
  gj_pol_name: string;

  gj_pod_id: string;
  gj_pod_code: string;
  gj_pod_name: string;

  gj_container_no: string;
  gj_seal_no: string;
  gj_igmitem_no: string;
  gj_loaded_on: string;
  gj_unloaded_on: string;

  gj_cfs: string;
  gj_from: string;
  gj_to1: string;
  gj_to2: string;

  gj_type_id: string;
  gj_type_code: string;
  gj_type_name: string;

  gj_remarks: string;
  gj_consignee_name: string;
  gj_consignee_add1: string;
  gj_consignee_add2: string;
  gj_consignee_add3: string;
  gj_vehicle_no: string;
  gj_cargo: string;
  gj_booking_no: string;
  gj_liner_name: string;
  gj_vessel: string;
  gj_gr_wt: number;
  gj_cartons: string;

  gj_lr_no: string;
  gj_our_refno: string;

  gj_mbl_no: string;
  gj_hbl_no: string;
  gj_frt_status: string;
  gj_cha_name: string;
  gj_sb_no: string;
  gj_commodity: string;

  gj_ar_invnos: string;
  gj_ar_amt: number;
  gj_ar_gst: number;

  gj_ap_invnos: string;
  gj_ap_amt: number;
  gj_ap_gst: number;
  gj_pack_list_no:string;
  gj_refno:string;
  gj_driver_name:string;

  rec_mode: string;
  rec_category: string;

  hbl_ar_invamt: number;
  _globalvariables: GlobalVariables;
}
