
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Hblm } from '../models/hbl';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class HblService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Hbl/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Hbl/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Hblm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Hbl/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Hbl/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    JobList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Hbl/JobList', SearchData, this.gs.headerparam2('authorized'));
    
    }

    GetCreditLimit(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Job/GetCreditLimit', SearchData, this.gs.headerparam2('authorized'));
    }
  



}

