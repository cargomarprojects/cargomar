import { createFeatureSelector,createSelector } from '@ngrx/store';
import { LedgerReport } from '../models/ledgerreport';
import { AppState } from '../../reducers';

import * as PandlActions from './pandl.actions';
import { PandlReportState } from './pandl.model'

export interface AppState extends AppState {
    'pandl': PandlReportState
}

export const initialState: PandlReportState = {
    urlid : '',
    pkid  : '',
    searchstring : '',
    from_date : '',
    to_date : '',
    ismaincode : false,
    ismonthwise : false,
    page_count :0,
    page_current : 0,
    page_rowcount :0,
    records : []
};

export function Pandlreducer(state: PandlReportState[] = [initialState], action: PandlActions.PandlActions): PandlReportState [] {
  switch (action.type) {
    case PandlActions.PandlActionTypes.ADD:
        return [...state,action.payload];
    case PandlActions.PandlActionTypes.UPDATE:
        return [...state.filter(rec => rec.urlid != action.payload.id), action.payload.changes];
    case PandlActions.PandlActionTypes.DELETE:
        return [...state.filter(rec => rec.urlid != action.payload.id)];
    default:
      return state;
  }
}

export const getPandlReportState = createFeatureSelector<PandlReportState[]>('pandl');

export const getPandlState = (urlid : string ) => createSelector(
    getPandlReportState,
    (state : PandlReportState[]) =>  state.find( rec => rec.urlid == urlid)
);

export const getPandlStateRec = (urlid : string ) => createSelector(
    getPandlState(urlid),
    (state : PandlReportState) => state 
);

 
