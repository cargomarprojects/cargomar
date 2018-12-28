import { Action } from '@ngrx/store';
import { LedgerReport } from '../models/ledgerreport'
import { PandlReportState } from './pandl.model'

export enum PandlActionTypes {
  ADD = '[Books] Add One',
  UPDATE = '[Books] Update One',
  DELETE = '[Books] Delete One',
}

export class Add implements Action {
  readonly type = PandlActionTypes.ADD;
  constructor(public payload : PandlReportState) { }
}
export class Update implements Action {
  readonly type = PandlActionTypes.UPDATE;
  constructor(public payload : { id: string, changes : PandlReportState }){ }
}
export class Delete implements Action {
  readonly type = PandlActionTypes.DELETE;
  constructor(public payload : { id: string}) { }
}

export type PandlActions= Add | Update | Delete