
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Linkm2 } from '../models/linkm2';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class Linkm2Service {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Link2/List', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Linkm2) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Link2/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Link2/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Link2/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

}

