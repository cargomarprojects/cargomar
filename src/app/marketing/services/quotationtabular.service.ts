
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { iMark_QtndTabularModel, Mark_Qtnm, SaveTermsData, initialState_QtnmTabular } from '../models/quotation';
import { GlobalService } from '../../core/services/global.service';

// TABULAR-QTN: HTTP service for the TABULAR quotation type. Cloned from
// QuotationFclService; same auth header, baseUrl + /api/Master/QuotationTabular/*.
@Injectable()
export class QuotationTabularService {

    private screen_id = '';
    private screen_type = '';
    public state: iMark_QtndTabularModel = { ...initialState_QtnmTabular };

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
        this.state = { ...initialState_QtnmTabular };
        this.state.Initialized = false;
        this.state.searchstring = '';

        this.gs.appStates[this.screen_id] = this.state;
      }
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationTabular/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationTabular/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Mark_Qtnm) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationTabular/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationTabular/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveTerms(Record: SaveTermsData) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationTabular/SaveTerms', Record, this.gs.headerparam2('authorized'));
    }

    PrintQuotation(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationTabular/PrintQuotation', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveQuotationJson(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationTabular/SaveQuotationJson', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveFreeTimelabel(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationTabular/SaveFreeTimelabel', SearchData, this.gs.headerparam2('authorized'));
    }
}
