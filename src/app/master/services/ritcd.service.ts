
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Ritcd } from '../models/ritcd';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class RitcdService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ritcd/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ritcd/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Ritcd) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ritcd/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ritcd/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Ritcd/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}

