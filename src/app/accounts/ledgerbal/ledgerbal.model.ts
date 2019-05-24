
import { LedgerReport } from '../models/ledgerreport'

export interface LedgerReportState{ 
    urlid : string,
    pkid : string,    
    searchstring : string,
    from_date : string ,
    to_date : string ,
    ismaincode : boolean,
    isloaded : boolean,
    branch_code : string,
    acc_pkid : string ,
    acc_code : string ,
    acc_name : string ,
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : LedgerReport[]
}