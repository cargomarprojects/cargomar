
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Yearm } from '../../core/models/yearm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class YearmService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Yearm/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Yearm/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Yearm) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Yearm/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Yearm/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }


}

