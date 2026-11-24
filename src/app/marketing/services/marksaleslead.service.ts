
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MarkSalesleadm,MarkSalesleadd, iMarkSalesleadmModel, initialState } from '../models/marksaleslead';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MarkSalesleadService {

    private screen_id = '';
    private screen_type = '';
    public state: iMarkSalesleadmModel = { ...initialState };

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
        this.state.Initialized = false;
        this.state.from_date = '';
        this.state.to_date = '';
        this.state.searchstring = '';
        this.state.searchstatus  = 'ALL';
        this.state.searchconverted = 'ALL';

        this.gs.appStates[this.screen_id] = this.state;
      }
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: MarkSalesleadm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    getSalesleadActions(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/getSalesleadActions', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveSalesleadActions(Record: MarkSalesleadd) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/SaveSalesleadActions', Record, this.gs.headerparam2('authorized'));
    }

    GetRecordSalesleadActions(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/GetRecordSalesleadActions', SearchData, this.gs.headerparam2('authorized'));
    }

    PrintSaleslead(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/PrintSaleslead', SearchData, this.gs.headerparam2('authorized'));
    }
}

