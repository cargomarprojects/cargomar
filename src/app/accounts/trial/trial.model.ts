

import { LedgerReport } from '../models/ledgerreport'

export interface TrialReportState{ 
    urlid : string,
    pkid : string,    
    searchstring : string,
    from_date : string ,
    to_date : string ,
    ismaincode : boolean,
    shownote : boolean,
    isall : boolean,
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : LedgerReport[]
}