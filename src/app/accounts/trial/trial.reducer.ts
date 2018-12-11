import { Action } from '@ngrx/store';
import { LedgerReport } from '../models/ledgerreport';
import { AppState } from '../../reducers';

export const TRIAL_LIST = '[Trial] List';

export class List implements Action {
  readonly type = TRIAL_LIST;
  constructor(public payload: LedgerReportState) {}
}
export type Actions = List;


export interface AppState extends AppState {
    'accounts': LedgerReportState
}

export interface LedgerReportState{
    urlid : string ,
    pkid : string,    
    page_count :number;
    page_current :number;
    page_rowcount :number;    
    records: LedgerReport[];
}
export const initialState: LedgerReportState = {
    urlid : '',
    pkid : '',
    page_count :0,
    page_current :0,
    page_rowcount :0,
    records: [],
};
export function Trialreducer(state = initialState, action: Actions): LedgerReportState {
    switch (action.type) {
        case TRIAL_LIST :
            return action.payload;
        default:    
            return  state ;
    }
}
