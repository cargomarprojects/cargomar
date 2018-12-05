
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Packingm } from '../models/packing';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class PackingService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Packing/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Packing/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Packingm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Packing/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Packing/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Packing/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

}

