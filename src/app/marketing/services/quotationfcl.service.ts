
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {Mark_Qtnm, Mark_Qtnd,SaveTermsData } from '../models/quotation';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class QuotationFclService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationFcl/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationFcl/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Mark_Qtnm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationFcl/Save', Record, this.gs.headerparam2('authorized'));
    }
    
    PrintQuotation(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationFcl/PrintQuotation', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationFcl/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveTerms(Record: SaveTermsData) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/QuotationFcl/SaveTerms', Record, this.gs.headerparam2('authorized'));
    }

}

