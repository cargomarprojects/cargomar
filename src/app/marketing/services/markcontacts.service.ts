
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { iMarkContactsModel, initialState, MarkContacts } from '../models/markcontacts';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MarkContactService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }


  private screen_id = '';
  public state: iMarkContactsModel = { ...initialState };

  public init(_screen_id: string) {
    this.screen_id = _screen_id;
    this.loadState();
  }

  private loadState() {
    if (this.gs.appStates[this.screen_id])
      this.state = this.gs.appStates[this.screen_id];
    else {
      this.state = { ...initialState };
      //default values
      //this.state.from_date = this.gs.getNewdate(180);
      //this.state.to_date = this.gs.defaultValues.today;
      this.gs.appStates[this.screen_id] = this.state;
    }
  }



  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: MarkContacts) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  JobList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/JobList', SearchData, this.gs.headerparam2('authorized'));
  }

  UpdateJobDetail(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/UpdateJobDetail', SearchData, this.gs.headerparam2('authorized'));
  }

  UpdateCustomer(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/UpdateCustomer', SearchData, this.gs.headerparam2('authorized'));
  }

  GetGroupName(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/GetGroupName', SearchData, this.gs.headerparam2('authorized'));
  }
}

