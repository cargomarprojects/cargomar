import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TdsExemption, iTdsExemptionSearch, iTdsExemptionModel, initialState } from '../models/tdsexemption';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TdsExemptionService {

  private screen_id = '';
  public state: iTdsExemptionModel = { ...initialState };

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  private loadState() {
    if (this.gs.appStates[this.screen_id])
      this.state = this.gs.appStates[this.screen_id];
    else {
      this.state = { ...initialState };
      this.gs.appStates[this.screen_id] = this.state;
    }
  }

  public init(_screen_id: string) {
    this.screen_id = _screen_id;
    this.loadState();
  }

  private setData(_data: any) {
    this.state.ErrorMessage = '';
    this.state.RecordList = _data.list;
    this.state.page_count = _data.page_count;
    this.state.page_current = _data.page_current;
    this.state.page_rowcount = _data.page_rowcount;
  }
  private setError(_data: any) {
    this.state.ErrorMessage = _data.message;
    this.state.RecordList = [];
  }

  public UpdateList(record: TdsExemption, bAdd: boolean) {
    if (bAdd)
      this.state.RecordList.push({ ...record });
    else {
      this.state.RecordList = this.state.RecordList.map(m => {
        if (m.te_pkid == record.te_pkid)
          return record;
        else
          return m;
      })
    }
  }

   
  public updateRowId(_id: number) {
    this.state.selectedRowIndex  = _id;
  }

  public getSelectedRow() {
    return this.state.selectedRowIndex;
  }
   
  public getErrorMessage() {
    return this.state.ErrorMessage;
  }

  public setMode(_mode: string) {
    this.state.mode = _mode;
  }

  public getMode() {
    return this.state.mode;
  }

  public getList(searchRecord: any) {
    this.List(searchRecord)
      .subscribe({
        next: (v: any) => {
          this.setData(v);
        },
        error: (v) => {
          this.setError(v);
        }
      });
  }

  public getRecord(id: number) {
    let params = {
      'id': id
    }
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/TdsExemption/GetRecord', params, this.gs.headerparam2('authorized'));
  }

  // public save(id: number, record: any) {
  //   let params = {
  //     'id': id
  //   }
  //   return this.http.post<IUser>(this.gs.getUrl('/api/user/SaveAsync'), record, { params: params });
  // }



  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/TdsExemption/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/TdsExemption/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: TdsExemption) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/TdsExemption/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Taxm/TdsExemption', SearchData, this.gs.headerparam2('authorized'));
  }




}

