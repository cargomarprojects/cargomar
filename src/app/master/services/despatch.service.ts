
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Despatchm } from '../models/despatch';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class DespatchService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Despatch/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Despatch/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Despatchm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Despatch/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Despatch/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
     
    PrintDespatch(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Despatch/PrintDespatch', SearchData, this.gs.headerparam2('authorized'));
    }
}

