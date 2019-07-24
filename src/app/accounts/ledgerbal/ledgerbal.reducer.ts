
import { createFeatureSelector,createSelector } from '@ngrx/store';
import { LedgerReport } from '../models/ledgerreport';
import { AppState } from '../../reducers';

import * as LedgerReportActions from './ledgerbal.actions';
import { LedgerReportState } from './ledgerbal.model'

export interface AppState extends AppState {
    'ledgerreport': LedgerReportState
}

export const initialState: LedgerReportState = {
    urlid : '',
    pkid  : '',
    searchstring : '',
    from_date : '',
    to_date : '',
    acc_pkid : '',
    acc_code : '',
    acc_name : '',
    ismaincode : false,
    showtotaldrcr :false,
    branch_code : '',
    isloaded : false,
    page_count :0,
    page_current : 0,
    page_rowcount :0,
    records : []
};

export function LedgerReportreducer(state: LedgerReportState[] = [initialState], action: LedgerReportActions.LedgerReportActions): LedgerReportState [] {
  switch (action.type) {
    case LedgerReportActions.LedgerActionTypes.ADD:
        return [...state,action.payload];
    case LedgerReportActions.LedgerActionTypes.UPDATE:
        return [...state.filter(rec => rec.urlid != action.payload.id), action.payload.changes];
    case LedgerReportActions.LedgerActionTypes.DELETE:
        return [...state.filter(rec => rec.urlid != action.payload.id)];
    default:
      return state;
  }
}

export const getLedgerReportState = createFeatureSelector<LedgerReportState[]>('ledgerreport');

export const getLedgerState = (urlid : string ) => createSelector(
    getLedgerReportState,
    (state : LedgerReportState[]) =>  state.find( rec => rec.urlid == urlid)
);

export const getLedgerStateRec = (urlid : string ) => createSelector(
    getLedgerState(urlid),
    (state : LedgerReportState) => state 
);

 
