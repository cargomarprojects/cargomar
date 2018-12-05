import { GlobalVariables } from '../../core/models/globalvariables';

export class ItemDet {
    itm_parent_id: string;
    itm_prod_code_type: string;
    itm_prod_grower_code: string;
    itm_prod_address1: string;
    itm_prod_address2: string;
    itm_prod_city: string;
    itm_prod_subdiv: string;
    itm_prod_pin: string;
    itm_prod_country_id: string;
    itm_prod_country_name: string;
    itm_prod_state_id: string;
    itm_prod_state_code: string;
    itm_prod_transit_country_id: string;
    itm_prod_transit_country_name: string;
    itm_ar4no: string;
    itm_ar4date: string;
    itm_ar4commrate: string;
    itm_ar4division: string;
    itm_ar4range: string;
    itm_ar4remarks: string;

    itm_dfia_sion_group_code: string;
    itm_dfia_sion_slno: string;
    itm_dfia_sion_norm_slno: string;
    itm_dfia_qty: number;
    itm_dfia_unit_id: string;
    itm_dfia_unit_code: string;
    itm_dfia_unit_name: string;
    itm_dfia_item_desc: string;
    itm_dfia_characteristics: string;
    itm_dfia_filenumber: string;
    itm_dfia_licno: string;
  
    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
}

