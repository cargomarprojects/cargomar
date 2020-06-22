import { GlobalVariables } from '../../core/models/globalvariables';
import { Bldesc } from '../../operations/models/bdesc';

export class Bl {

  bl_pkid: string;
  bl_shipper_id: string;
  bl_shipper_br_id: string;
  bl_shipper_br_no: string;
  bl_shipper_code: string;
  bl_shipper_name: string;
  bl_shipper_add1: string;
  bl_shipper_add2: string;
  bl_shipper_add3: string;
  bl_shipper_add4: string;

  bl_consignee_id: string;
  bl_consignee_br_id: string;
  bl_consignee_br_no: string;
  bl_consignee_code: string;
  bl_consignee_name: string;
  bl_consignee_add1: string;
  bl_consignee_add2: string;
  bl_consignee_add3: string;
  bl_consignee_add4: string;
  bl_issued_by1: string;
  bl_issued_by2: string;
  bl_issued_by3: string;
  bl_issued_by4: string;
  bl_issued_by5: string;
  bl_notify_id: string;
  bl_notify_br_id: string;
  bl_notify_br_no: string;
  bl_notify_code: string;
  bl_notify_name: string;
  bl_notify_add1: string;
  bl_notify_add2: string;
  bl_notify_add3: string;
  bl_notify_add4: string;

  bl_notify_city_code: string;
  bl_notify_country_code: string;

  bl_place_receipt: string;
  bl_date_receipt: string;
  bl_pol: string;
  bl_pol_code: string;
  bl_pod: string;
  bl_pod_code: string;
  bl_place_delivery: string;
  bl_delivery_contact1: string;
  bl_delivery_contact2: string;
  bl_delivery_contact3: string;
  bl_delivery_contact4: string;
  bl_delivery_contact5: string;
  bl_delivery_contact6: string;
  bl_reg_no: string;
  bl_bl_no: string;
  bl_fcr_no: string;
  bl_fcr_doc1: string;
  bl_fcr_doc2: string;
  bl_fcr_doc3: string;
  bl_vsl_name: string;
  bl_vsl_voy_no: string;
  bl_period_delivery: string;
  bl_move_type: string;
  bl_place_transhipment: string;

  bl_is_mark1: boolean;
  bl_is_mark2: boolean;
  bl_is_mark3: boolean;
  bl_is_mark4: boolean;
  bl_is_mark5: boolean;
  bl_is_mark6: boolean;
  bl_is_mark7: boolean;
  bl_is_mark8: boolean;
  bl_is_mark9: boolean;
  bl_is_mark10: boolean;
  bl_is_mark11: boolean;
  bl_is_mark12: boolean;
  bl_is_mark13: boolean;
  bl_is_mark14: boolean;
  bl_is_mark15: boolean;
  bl_is_mark16: boolean;
  bl_is_mark17: boolean;
  bl_is_mark18: boolean;

  bl_mark1: string;
  bl_mark2: string;
  bl_mark3: string;
  bl_mark4: string;
  bl_mark5: string;
  bl_mark6: string;
  bl_mark7: string;
  bl_mark8: string;
  bl_mark9: string;
  bl_mark10: string;
  bl_mark11: string;
  bl_mark12: string;
  bl_mark13: string;
  bl_mark14: string;
  bl_mark15: string;
  bl_mark16: string;
  bl_mark17: string;
  bl_mark18: string;
  bl_mark19: string;
  bl_mark20: string;
  bl_mark21: string;
  bl_mark22: string;
  bl_mark23: string;
  bl_mark24: string;

  bl_desc1: string;
  bl_desc2: string;
  bl_desc3: string;
  bl_desc4: string;
  bl_desc5: string;
  bl_desc6: string;
  bl_desc7: string;
  bl_desc8: string;
  bl_desc9: string;
  bl_desc10: string;
  bl_desc11: string;
  bl_desc12: string;
  bl_desc13: string;
  bl_desc14: string;
  bl_desc15: string;
  bl_desc16: string;
  bl_desc17: string;
  bl_desc18: string;

  bl_2desc1: string;
  bl_2desc2: string;
  bl_2desc3: string;
  bl_2desc4: string;
  bl_2desc5: string;
  bl_2desc6: string;
  bl_2desc7: string;
  bl_2desc8: string;
  bl_2desc9: string;
  bl_2desc10: string;
  bl_2desc11: string;
  bl_2desc12: string;
  bl_2desc13: string;
  bl_2desc14: string;

  bl_grwt: number;
  bl_ntwt: number;
  bl_cbm: number;
  bl_pcs: number;
  bl_pcs_unit: string;

  bl_grwt_caption: string;
  bl_ntwt_caption: string;
  bl_cbm_caption: string;
  bl_pcs_caption: string;
  bl_pcs_unit_caption: string;

  bl_frt_amount: number;
  bl_frt_pay_at: string;
  bl_issued_place: string;
  bl_issued_date: string;
  bl_no_copies: number;
  bl_remarks1: string;
  bl_remarks2: string;
  bl_remarks3: string;
  bl_remarks4: string;
  bl_is_original: boolean;
  bl_brazil_declaration: boolean;

  hbl_date: string;
  hbl_blno_generated: string;
  hbl_fcr_no: string;
  hbl_bl_no: string;
  hbl_seq_format_id: string;
  bl_print_format_id: string;
  bl_print_format_name: string;
  bl_print: string;
  bl_original_print: string;

  rec_mode: string;
  rec_category: string;

  _globalvariables: GlobalVariables;
  AttachList: Bldesc[] = [];

  bl_is_original_cnee: boolean;
  bl_is_original_carr: boolean;
  bl_issued_by: string;
  bl_account_info1: string;
  bl_account_info2: string;
  bl_account_info3: string;
  bl_account_info4: string;
  bl_iata_code: string;
  bl_acc_no: string;
  bl_by1_carrier: string;
  bl_by2_carrier: string;
  bl_flight1: string;
  bl_flight2: string;
  bl_hand_info1: string;
  bl_hand_info2: string;
  bl_hand_info3: string;
  bl_by1_agent: string;
  bl_by2_agent: string;
  bl_issu_agnt_name: string;
  bl_issu_agnt_city: string;
  bl_commodity: string;
  bl_ins_amt: string;
  bl_iata_carrier: string;
  bl_to1: string;
  bl_by1: string;
  bl_to2: string;
  bl_by2: string;
  bl_to3: string;
  bl_by3: string;
  bl_frt_status: string;
  bl_oc_status: string;
  bl_wt_unit: string;
  bl_ex_works: string;
  bl_carriage_value: string;
  bl_customs_value: string;
  bl_asarranged: string;
  bl_asarranged_shipper: string;
  bl_asarranged_consignee: string;
  bl_charges1_agent: string;
  bl_charges2_agent: string;
  bl_charges3_agent: string;
  bl_charges4_agent: string;
  bl_charges5_agent: string;
  bl_charges1_carrier: string;
  bl_charges2_carrier: string;
  bl_charges3_carrier: string;
  bl_charges4_carrier: string;
  bl_charges5_carrier: string;
  bl_charges6_carrier: string;
  bl_charges7_carrier: string;
  bl_charges8_carrier: string;
  bl_chwt: number;
  bl_class: string;
  bl_comm: string;
  bl_rate: number;
  bl_total: number;
  bl_currency: string;
  bl_mbl_no: string;
  bl_invoke_frm: string;
  bl_direct: boolean;
  bl_itm_desc: string;
  bl_itm_po: string;

  bl_shipper_st_code: string;
  bl_shipper_cntry_code: string;
  bl_consignee_st_code: string;
  bl_consignee_cntry_code: string;
  bl_notify_st_code: string;
  bl_notify_cntry_code: string;
}

