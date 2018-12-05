
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Custdet } from '../models/custdet';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class CustdetService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustDetm/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustDetm/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Custdet) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustDetm/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustDetm/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustDetm/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }


}

