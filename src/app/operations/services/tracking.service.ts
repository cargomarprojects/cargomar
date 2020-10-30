
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { Trackingm } from '../models/tracking';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TrackingService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Trackingm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/DeleteRecord', SearchData, this.gs.headerparam2('authorized'))
    }

    TransitTrackingList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Tracking/TransitTrackingList', SearchData, this.gs.headerparam2('authorized'));
    }

}

