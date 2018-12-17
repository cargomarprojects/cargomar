import { createFeatureSelector,createSelector } from '@ngrx/store';
import { LedgerReport } from '../models/ledgerreport';
import { AppState } from '../../reducers';

import * as TrialActions from './trial.actions';
import { TrialReportState } from './trial.model'

export interface AppState extends AppState {
    'trial': TrialReportState
}

export const initialState: TrialReportState = {
    urlid : '',
    pkid  : '',
    searchstring : '',
    from_date : '',
    to_date : '',
    ismaincode : false,
    page_count :0,
    page_current : 0,
    page_rowcount :0,
    records : []
};

export function Trialreducer(state: TrialReportState[] = [initialState], action: TrialActions.TrialActions): TrialReportState [] {
  switch (action.type) {
    case TrialActions.TrialActionTypes.ADD:
        return [...state,action.payload];
    case TrialActions.TrialActionTypes.UPDATE:
        return [...state.filter(rec => rec.urlid != action.payload.id), action.payload.changes];
    case TrialActions.TrialActionTypes.DELETE:
        return [...state.filter(rec => rec.urlid != action.payload.id)];
    default:
      return state;
  }
}

export const getTrialReportState = createFeatureSelector<TrialReportState[]>('trial');

export const getTrialState = (urlid : string ) => createSelector(
    getTrialReportState,
    (state : TrialReportState[]) =>  state.find( rec => rec.urlid == urlid)
);

export const getTrialStateRec = (urlid : string ) => createSelector(
    getTrialState(urlid),
    (state : TrialReportState) => state 
);

 
