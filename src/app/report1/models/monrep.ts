
import { GlobalVariables } from '../../core/models/globalvariables';

export class MonRep {
  sino: string;
  folder_no: string;
  folder_sent: string;
  mbl_no: string;
  mbl_date: number;
  mbl_status: string;
  hbl_no: number;
  hbl_date: number;
  hbl_status: string;
  shipper_name: string;
  consignee_name: string;
  agent_name: string;
  hbl_nomination: string;
  carrier_name: string;
  pol_name: string;
  pod_name: string;
  pofd_name: string;
  pol_etd: number;
  sman_name: string;
  hbl_grwt: number;
  hbl_chwt: number;
  mbl_grwt: number;
  mbl_chwt: number;
  netnet: string;
  publish_rate: number;
  informed_rate: number;
  sell_informed: string;
  rebate: number;
  exworks: number;
  commodty_name: string;

  hbl_type: string;
  hbl_book_cntr_teu: string;
  hbl_cbm: string;
  hbl_nature: string;
  hbl_book_cntr: string;
  hbl_job_nos: string;
  hbl_ntwt: string;

  mbl_nature: string; 
  shipment_type: string;

  hbl_ar_invnos: string;
  hbl_ar_invamt: number;
  hbl_ar_gstamt: number;

  branch: string;
  agent_created_date: string;
  
  hbl_sell_rate_pp:number;
  hbl_sell_rate_cc:number;
  hbl_buy_rate_pp:number;
  hbl_buy_rate_cc:number;

  hbl_pkid: string; 
  sman_id: string;
  displayed: boolean;

  created_date: string;
  
    _globalvariables: GlobalVariables;
}
