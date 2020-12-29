
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { SeaBuyRate } from '../models/seabuyrate';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class SeaBuyRateService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/SeaBuyRate/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/SeaBuyRate/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    CanSave(Record: SeaBuyRate) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/SeaBuyRate/CanSave', Record, this.gs.headerparam2('authorized'));
    }

    Save(Record: SeaBuyRate) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/SeaBuyRate/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/SeaBuyRate/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/SeaBuyRate/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

}

