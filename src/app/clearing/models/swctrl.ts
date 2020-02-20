import { GlobalVariables } from '../../core/models/globalvariables';

export class SwCtrl {
    sw_pkid: string;
    sw_jobid: string;
    sw_itmid: string;
    sw_year: number;
    sw_serial_no: number;
    sw_ctrl_type_id: string;
    sw_ctrl_type_code: string;
    sw_ctrl_type_name: string;
    sw_ctrl_location: string;
    sw_ctrl_startdate: string;
    sw_ctrl_enddate: string;
    sw_ctrl_result_id: string;
    sw_ctrl_result_code: string;
    sw_ctrl_result_name: string;

    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
}

