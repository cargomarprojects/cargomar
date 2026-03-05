import { GlobalVariables } from '../../core/models/globalvariables';
export class Ftplog {
    ftp_pkid: string;
    ftp_from: string;
    ftp_to: string;
    ftp_date: string;
    ftp_action: string;
    ftp_module: string;
    ftp_module_pkid: string;
    ftp_subject: string;
    ftp_is_ack: string;
    ftp_process_id: string;
    ftp_comp_code: string;
    ftp_branch_code: string;
    ftp_user_code: string;
    ftp_remarks: string;
    ftp_isread: string;
    ftp_file_path: string;

    ftp_mblbk_no: string;
    ftp_mbl_etd: string;
    ftp_house_no: string;
    ftp_days_after_etd: string;
    ftp_mbl_id: string;
    ftp_min_ftp_date: string;
    ftp_max_ftp_date: string;
    ftp_multiple_upload: string;
    
    rec_mode: string;
    _globalvariables: GlobalVariables;
}
