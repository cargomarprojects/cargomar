import { Action } from '@ngrx/store';
import { LedgerReport } from '../models/ledgerreport';

export const TRIAL_LIST = '[Trial] List';

export class ListReport implements Action {
  readonly type = TRIAL_LIST;
  constructor(public payload: TrialReportState) {}
}
export type Actions = ListReport;

export interface TrialReportState{
    urlid : string ,
    pkid : string,    
    ismaincode : boolean,
    page_count :number;
    page_current :number;
    page_rowcount :number;    
    records: LedgerReport[];
}
export const initialState: TrialReportState = {
    urlid : '',
    pkid : '',
    ismaincode : false,
    page_count :0,
    page_current :0,
    page_rowcount :0,
    records: [],
};
export function Trialreducer(state = initialState, action: Actions): TrialReportState {
    switch (action.type) {
        case TRIAL_LIST :
            return action.payload;
        default:    
            return  state ;
    }
}
