
import { Action } from '@ngrx/store';
import { LedgerReport } from '../models/ledgerreport'
import { LedgerReportState } from './ledgerbal.model'

export enum LedgerActionTypes {
  ADD = '[Books] Add One',
  UPDATE = '[Books] Update One',
  DELETE = '[Books] Delete One',
}

export class Add implements Action {
  readonly type = LedgerActionTypes.ADD;
  constructor(public payload : LedgerReportState) { }
}
export class Update implements Action {
  readonly type = LedgerActionTypes.UPDATE;
  constructor(public payload : { id: string, changes : LedgerReportState }){ }
}
export class Delete implements Action {
  readonly type = LedgerActionTypes.DELETE;
  constructor(public payload : { id: string}) { }
}

export type LedgerReportActions= Add | Update | Delete