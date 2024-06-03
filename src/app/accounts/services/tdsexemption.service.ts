import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TdsExemption, iTdsExemptionSearch, iTdsExemptionModel, initialState } from '../models/tdsexemption';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TdsExemptionService {

  private screen_id = '';
  private state: iTdsExemptionModel = { ...initialState };


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
    this.state.errorMessage = '';
    this.state.records = _data.list;
  }
  private setError(_data: any) {
    this.state.errorMessage = _data.message;
    this.state.records = [];
  }

  public UpdateList(record: TdsExemption, bAdd: boolean) {
    if (bAdd)
      this.state.records.push({ ...record });
    else {
      this.state.records = this.state.records.map(m => {
        if (m.te_pkid == record.te_pkid)
          return record;
        else
          return m;
      })
    }
  }

  public updateSearchQuery(_Record: iTdsExemptionSearch) {
    this.state.searchQuery = { ..._Record };
  }

  public updateRowId(_id: number) {
    this.state.selected_row_id = _id;
  }

  public getSelectedRow() {
    return this.state.selected_row_id;
  }

  public getRecords() {
    return this.state.records;
  }

  public getSearchQuery() {
    return this.state.searchQuery
  }

  public getErrorMessage() {
    return this.state.errorMessage;
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

