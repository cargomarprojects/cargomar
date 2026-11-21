
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { iMarkContactsModel, initialState, MarkContacts } from '../models/markcontacts';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MarkContactService {

  private screen_id = '';
  private screen_type = '';
  public state: iMarkContactsModel = { ...initialState };

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  public init(_screen_id: string, _screen_type: string) {
    this.screen_id = _screen_id;
    this.screen_type = _screen_type;
    this.loadState();
  }

  private loadState() {
    if (this.gs.appStates[this.screen_id])
      this.state = this.gs.appStates[this.screen_id];
    else {
      this.state = { ...initialState };
      //default values
      this.state.Initialized = false;
      this.state.fromdate = '';
      this.state.todate = '';
      this.state.searchLeadSource = 'ALL';
      this.state.searchConvrtStatus = 'NA';
      this.state.searchSalesperson = this.gs.globalVariables.sman_name;
      this.state.searchSalesperson_id = this.gs.globalVariables.sman_id;
      this.state.searchstring = '';
      this.state.searchvalidation = 'NA';
      this.state.searchsortby = 'a.cont_name';
      this.state.searchdatetype = 'LAST-VISIT-DATE';
      this.state.cont_is_shipper = false;
      this.state.cont_is_consignee = false;
      this.state.cont_is_agent = false;
      this.state.cont_is_carrier = false;
      this.state.cont_is_buyingagent = false;
      this.state.cont_is_corporate = false;
      this.state.cont_is_convert = false;

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

