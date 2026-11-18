
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GenJobm, iGenJobmModel, initialState } from '../models/genjob';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class GenJobService {

    private screen_id = '';
    private screen_type = '';
    public state: iGenJobmModel = { ...initialState };

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
        this.state.searchstring = '';

        this.gs.appStates[this.screen_id] = this.state;
      }
    }


    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: GenJobm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    GenerateLRNo(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/GenerateLRNo', SearchData, this.gs.headerparam2('authorized'));
    }

    PrintReceipt(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/GenJob/PrintReceipt', SearchData, this.gs.headerparam2('authorized'));
    }
}

