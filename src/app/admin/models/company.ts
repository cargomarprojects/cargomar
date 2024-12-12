import { GlobalVariables } from '../../core/models/globalvariables';


export class Companym {
    comp_pkid: string;
    comp_code: string;
    comp_name: string;
    comp_type: string;
    comp_parent_id: string;
    comp_parent_name: string;

    comp_address1: string;
    comp_address2: string;
    comp_address3: string;
    comp_tel: string;
    comp_fax: string;
    comp_web: string;
    comp_email: string;
    comp_ptc: string;
    comp_mobile: string;
    comp_prefix: string;
    comp_panno: string;
    comp_cinno: string;
    comp_gstin: string;

    comp_gstin_pin: string;
    comp_gstin_tel: string;
    comp_gstin_email: string;

    comp_gstin_state_code: string;
    comp_gstin_state_name: string;


    comp_reg_address: string;
    comp_iata_code: string;
    comp_location: string;
    comp_branch_type: string;
    comp_country_code: string;
    comp_pol_code: string;
    comp_order: number;
    comp_uamno: string;
    comp_gsp_token_expiry: number;

    comp_gsp_client_id: string;
    comp_gsp_client_secret: string;
    comp_gsp_token: string;
    comp_branch_number: number;

    comp_gsp_trial: boolean;
    comp_gsp_gstin: string;
    comp_gsp_user: string;
    comp_gsp_pwd: string;
    comp_lut_no: string;
    comp_gsp_otp: string;
    comp_gsp_otp_date: string;
    comp_gsp_otp_validto_date: string;
    rec_mode: string;
    _globalvariables: GlobalVariables;
}
