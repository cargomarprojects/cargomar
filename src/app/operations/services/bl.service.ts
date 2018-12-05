
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Bl } from '../models/bl';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class  BlService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Bl/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Bl) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Bl/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Bl/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    GenerateBLNumber(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Bl/GenerateBLNumber', SearchData, this.gs.headerparam2('authorized'))
    }

    UnlockOriginalBL(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Bl/UnlockOriginalBL', SearchData, this.gs.headerparam2('authorized'));
    }
    UpdateBL(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Bl/UpdateBL', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDescription(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Bl/LoadDescription', SearchData, this.gs.headerparam2('authorized'));
    }
}

