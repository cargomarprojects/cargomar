
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Ritcm } from '../models/ritcm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class RitcmService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ritcm/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ritcm/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Ritcm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ritcm/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ritcm/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }


}

