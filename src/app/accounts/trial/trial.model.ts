

import { LedgerReport } from '../models/ledgerreport'

export interface TrialReportState{ 
    urlid : string,
    pkid : string,    
    ismaincode : boolean,
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    selectedid : string;
    records : LedgerReport[]
}