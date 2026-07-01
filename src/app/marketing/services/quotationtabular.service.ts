
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Mark_Qtnm, SaveTermsData } from '../models/quotation';
import { GlobalService } from '../../core/services/global.service';

// TABULAR-QTN: HTTP service for the TABULAR quotation type. Cloned from
// QuotationFclService; same auth header, baseUrl + /api/Master/QuotationTabular/*.
@Injectable()
export class QuotationTabularService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
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

}
