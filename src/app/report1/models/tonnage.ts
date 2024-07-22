
import { GlobalVariables } from '../../core/models/globalvariables';

export class Tonnage {

  mbl_pkid: string;
  mbl_date: string;
  mbl_no: string;
  mbl_grwt: number;
  mbl_chwt: number;
  hbl_grwt: number;
  hbl_chwt: number;
  hbl_shipper_name: string;
  hbl_consignee_name: string;
  hbl_nomination: string;
  mbl_agent_name: string;
  mbl_airline_name: string;
  hbl_pod_name: string;
  hbl_pofd_name: string;
  mbl_status_name: string;
  mbl_pod_eta: string;
  hbl_billto_name:string;

  hbl_pol_name: string;
  branch: string;
  JAN: string;
  FEB: string;
  MAR: string;
  APR: string;
  MAY: string;
  JUN: string;
  JUL: string;
  AUG: string;
  SEP: string;
  OCT: string;
  NOV: string;
  DEC: string;

  TableDataList: TblColumns[] = []; 

  _globalvariables: GlobalVariables;
}
export class TblColumns {
  col_header_name: string;
  col_field_name: string;
  col_class_style: string;
  col_field_value: number;
}