

import { LedgerReport } from '../models/ledgerreport'

export interface PandlReportState{ 
    urlid : string,
    pkid : string,    
    searchstring : string,
    from_date : string ,
    to_date : string ,
    ismaincode : boolean,
    ismonthwise : boolean,
    isall:boolean,
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : LedgerReport[]
}