
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {Mark_Qtnm, iMark_QtndAirModel,SaveTermsData, initialStateQtnmAir } from '../models/quotation';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class QuotationAirService {

    private screen_id = '';
    private screen_type = '';
    public state: iMark_QtndAirModel = { ...initialStateQtnmAir };

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
        this.state = { ...initialStateQtnmAir };
        this.state.Initialized = false;
        this.state.searchstring = '';

        this.gs.appStates[this.screen_id] = this.state;
      }
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationAir/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationAir/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Mark_Qtnm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationAir/Save', Record, this.gs.headerparam2('authorized'));
    }
    
    PrintQuotation(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationAir/PrintQuotation', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationAir/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveTerms(Record: SaveTermsData) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationAir/SaveTerms', Record, this.gs.headerparam2('authorized'));
    }

}

