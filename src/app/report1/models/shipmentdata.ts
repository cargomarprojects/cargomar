import { GlobalVariables } from '../../core/models/globalvariables';
export class ShipmentData {
    sd_pkid: string;
    sd_ref_slno: number;
    sd_mode: string;
    sd_date: string;
    sd_hs_code: string;
    sd_product: string;
    sd_indian_company: string;
    sd_address1: string;
    sd_address2: string;
    sd_address3: string;
    sd_pin: string;
    sd_foreign_country: string;
    sd_indian_port: string;
    sd_foreign_port: string;
    sd_qty: number;
    sd_unit: string;
    sd_city: string;
    sd_region: string;
    sd_created_date: string;
    sd_selected: boolean;
    sd_disabled: boolean;
    sd_shipment: number;
    sd_report_name: string;
    _globalvariables: GlobalVariables;
}

export class SaveShipData {
    ssd_pkid: string;
    ssd_mode: string;
    ssd_group: string;
    ssd_type: string;
    ssd_update_city: string;
    ssd_update_region: string;
    ssd_report_name: string;
    ssd_report_created_by: string;
    ssd_report_created_date: string;
    rec_mode: string;
    ssd_allselected: boolean;
    ssd_List: ShipmentData[] = [];
    _globalvariables: GlobalVariables;
}