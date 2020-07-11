
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { JobIncome } from '../models/jobincome';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class JobIncomeService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobIncome/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobIncome/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: JobIncome) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobIncome/Save', Record, this.gs.headerparam2('authorized'));
    }

    SaveSpecialRebate(Record: JobIncome) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobIncome/SaveSpecialRebate', Record, this.gs.headerparam2('authorized'));
    }


    SaveQuotation(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobIncome/SaveQuotation', SearchData, this.gs.headerparam2('authorized'));
    }




    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobIncome/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobIncome/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
    PrintFrightMemo(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobIncome/PrintFrightMemo', SearchData, this.gs.headerparam2('authorized'));
    }


}

