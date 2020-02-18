import { GlobalVariables } from '../../core/models/globalvariables';

export class InfoType {
    sw_pkid: string;
    sw_jobid: string;
    sw_itmid: string;
    sw_year: number;
    sw_serial_no: number;
    sw_info_type_id: string;
    sw_info_type_code: string;
    sw_info_type_name: string;
    sw_info_qfr_id: string;
    sw_info_qfr_code: string;
    sw_info_qfr_name: string;
    sw_info_code_id: string;
    sw_info_code_code: string;
    sw_info_code_name: string;
    sw_info_text: string;
    sw_info_msr: number;
    sw_info_uqc_id: string;
    sw_info_uqc_code: string;
    sw_info_uqc_name: string;

    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
}

