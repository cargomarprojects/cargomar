
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {Mark_Qtnm, Mark_Qtnd,SaveTermsData } from '../models/quotation';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class QuotationService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Quotation/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Quotation/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Mark_Qtnm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Quotation/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Quotation/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveTerms(Record: SaveTermsData) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Quotation/SaveTerms', Record, this.gs.headerparam2('authorized'));
    }

}

