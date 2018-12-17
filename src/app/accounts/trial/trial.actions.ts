import { Action } from '@ngrx/store';
import { LedgerReport } from '../models/ledgerreport'
import { TrialReportState } from './trial.model'

export enum TrialActionTypes {
  ADD = '[Books] Add One',
  UPDATE = '[Books] Update One',
  DELETE = '[Books] Delete One',
}

export class Add implements Action {
  readonly type = TrialActionTypes.ADD;
  constructor(public payload : TrialReportState) { }
}
export class Update implements Action {
  readonly type = TrialActionTypes.UPDATE;
  constructor(public payload : { id: string, changes : TrialReportState }){ }
}
export class Delete implements Action {
  readonly type = TrialActionTypes.DELETE;
  constructor(public payload : { id: string}) { }
}

export type TrialActions= Add | Update | Delete