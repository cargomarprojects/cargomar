
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MarkSalesVolume } from '../models/marksalesvolume';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MarkSalesVolumeService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSalesVolume/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSalesVolume/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: MarkSalesVolume) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSalesVolume/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSalesVolume/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

}

