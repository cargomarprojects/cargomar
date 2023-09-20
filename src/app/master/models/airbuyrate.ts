
import { GlobalVariables } from '../../core/models/globalvariables';

export class AirBuyRate {
  abr_pkid: string;
  abr_pol_id: string;
  abr_pod_id: string;
  abr_carrier_id: string;
  abr_country_id: string;
  abr_effective_date: string;
  abr_validity_date: string;
  abr_currency: string;
  abr_ex_rate: number;
  abr_gst_rate: number;
  abr_terms: string;
  abr_routing: string;
  abr_flights: string;
  abr_transit: string;
  abr_freight_min_rate: number;
  abr_freight_norm_rate: number;
  abr_mcc_min_rate: number;
  abr_mcc_norm_rate: number;
  abr_src_min_rate: number;
  abr_src_norm_rate: number;
  abr_published_allin: number;
  abr_published_45kg: number;
  abr_published_100kg: number;
  abr_published_300kg: number;
  abr_published_500kg: number;
  abr_published_1000kg: number;
  abr_published_fsckg: number;
  abr_published_wsckg: number;
  abr_published_srckg: number;
  abr_published_mcckg: number;
  abr_published_mccmin: number;
  abr_published_ssckg: number;
  abr_published_xraykg: number;
  abr_published_xraymin: number;
  abr_published_ens: number;
  abr_informed_allin: number;
  abr_informed_45kg: number;
  abr_informed_100kg: number;
  abr_informed_300kg: number;
  abr_informed_500kg: number;
  abr_informed_1000kg: number;
  abr_informed_fsckg: number;
  abr_informed_wsckg: number;
  abr_informed_srckg: number;
  abr_informed_mcckg: number;
  abr_informed_mccmin: number;
  abr_informed_ssckg: number;
  abr_informed_xraykg: number;
  abr_informed_xraymin: number;
  abr_informed_ens: number;
  abr_service: string;
  abr_surchrg_based: string;
  abr_remarks: string;
  abr_country_code: string;
  abr_country_name: string;
  abr_pod_code: string;
  abr_pol_code: string;
  abr_pod_name: string;
  abr_pol_name: string;
  abr_carrier_code: string;
  abr_carrier_name: string;

  rec_branch_code: string;

  rec_mode: string;
  _globalvariables: GlobalVariables;

}

export class BuyrateImport {
  pol_codes: string;
  pod_codes: string;
  carrier_codes: string;
  country_codes: string;
  records: BuyrateImportDet[];
  rec_created_by: string;
  rec_created_date: string;
  _globalvariables: GlobalVariables;
}

export class BuyrateImportDet {
  pol_code: string;
  country_code: string;
  pod_code: string;
  carrier_code: string;
  routing: string;
  service: string;
  transit: string;
  flights: string;
  currency: string;
  ex_rate: number;
  min_rate: number;
  norm_rate: number;
  informed_45kg: number;
  informed_100kg: number;
  informed_300kg: number;
  informed_500kg: number;
  informed_1000kg: number;
  informed_fsckg: number;
  informed_ssckg: number;
  informed_mcckg: number;
  informed_mccmin: number;
  informed_xraykg: number;
  informed_xraymin: number;
  informed_allin: number;
  informed_ens: number;
  surchrg_based: string;
  effective_date: string;
  validity_date: string;
  gst_rate: number;
  terms: string;
  remarks: string;
}
