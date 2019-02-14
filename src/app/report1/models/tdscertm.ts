import { GlobalVariables } from '../../core/models/globalvariables';
import { TdsCertd  } from '../models/TdsCertd';
export class TdsCertm {
    tds_pkid: string;
    tds_cert_no: string;
    tds_cert_qtr: string;
    tds_cert_brcode: string;
    tds_cert_brname: string;
    tds_tan_id: string;
    tds_tan_code: string;
    tds_tan_name: string;
    tds_year: number;
    tds_gross: number;
    tds_amt: number;
    tds_doc_count: number;
    
    rec_branch_code:string;
    rec_created_by:string;
    rec_mode: string;
    _globalvariables: GlobalVariables;

    TdsDetList: TdsCertd[] = [];
}