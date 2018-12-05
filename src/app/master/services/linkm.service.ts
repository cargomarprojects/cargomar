
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Linkm } from '../models/linkm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LinkmService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Link/List', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Linkm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Link/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Link/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Link/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

}

